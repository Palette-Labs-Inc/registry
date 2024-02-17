import { prisma } from "./db.server";
import { ethers } from "ethers";
import { NodeEntry, NodeStatus, NodeType } from "@prisma/client";
import { NodeRegistry__factory } from "@palette-labs/registry-contracts";

const batchSize = process.env.BATCH_SIZE ? Number(process.env.BATCH_SIZE) : 2000;
const requestDelay = process.env.REQUEST_DELAY ? Number(process.env.REQUEST_DELAY) : 0;

export const CHAIN_ID = Number(process.env.CHAIN_ID);
if (!CHAIN_ID) {
  throw new Error("No chain ID specified");
}

export type ChainConfig = {
  chainId: number;
  chainName: string;
  version: string;
  contractAddress: string;
  etherscanURL: string;
  subdomain: string;
  contractStartBlock: number;
  rpcProvider: string;
};


export const EAS_CHAIN_CONFIGS: ChainConfig[] = [
  {
    chainId: 84532,
    chainName: "base-sepolia",
    subdomain: "base-sepolia.",
    version: "1.2.0",
    contractAddress: "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb",
    contractStartBlock: 5789193,
    etherscanURL: "https://sepolia.basescan.org/",
    rpcProvider: `https://sepolia.base.org`,
  },
]

export const activeChainConfig = EAS_CHAIN_CONFIGS.find(
  (config) => config.chainId === CHAIN_ID
);

if (!activeChainConfig || !activeChainConfig.contractAddress) {
  throw new Error("No chain config found for chain ID");
}

export const provider = new ethers.JsonRpcProvider(
  activeChainConfig.rpcProvider,
  activeChainConfig.chainId
);


export const contractAddress = activeChainConfig.contractAddress;
export const CONTRACT_START_BLOCK = activeChainConfig.contractStartBlock;

// Timeout Promise
function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const nodeRegistry = NodeRegistry__factory.connect(activeChainConfig.contractAddress, provider);

function translateToNodeType(value: number): NodeType | undefined {
  const mapping: { [key: number]: NodeType } = {
      0: NodeType.PSN,
      1: NodeType.BSN,
      2: NodeType.GP
  };

  return mapping[value];
}

// Function to translate raw numeric values to NodeStatus enum strings
function translateToNodeStatus(value: number): keyof typeof NodeStatus | undefined {
  const mapping: { [key: number]: keyof typeof NodeStatus } = {
      0: 'INITIATED',
      1: 'VERIFIED',
      2: 'INVALID'
  };

  return mapping[value];
}


async function fetchAndParseRegisteredEvents(startBlock: number, endBlock: number): Promise<NodeEntry[]> {
  console.log(`Querying from ${startBlock} to ${endBlock}`); // Log the block range for confirmation

  const filter = nodeRegistry.filters.Registered();
  const events = await nodeRegistry.queryFilter(filter, startBlock, endBlock);

  if (events.length === 0) {
      console.log(`No events found in the specified range. ${startBlock}, ${endBlock}`);
      return [];
  }

  return events.map(event => {
      const { uid, name, callbackUrl, location, industryCode, owner, nodeType, status } = event.args[2];
      return {
          uid, name, callbackUrl, location, industryCode, owner,
          nodeType: translateToNodeType(Number(nodeType)) || 'PSN', 
          status: translateToNodeStatus(Number(status)) || 'INITIATED', // TODO: improve logic.
      };
  });
}


export async function getAndUpdateAllRelevantLogs() {
  const serviceStatPropertyName = "latestNodeEntryBlockNum";
  const { fromBlock } = await getStartData(serviceStatPropertyName);
  let currentBlock = fromBlock + 1;
  const latestBlock = await provider.getBlockNumber();

  while (currentBlock <= latestBlock) {
    const toBlock = Math.min(currentBlock + batchSize - 1, latestBlock);

    const nodeEntries = await fetchAndParseRegisteredEvents(currentBlock, toBlock);

    for (const node of nodeEntries) {
      await processRegisteredNode(node);
      await timeout(requestDelay);
    }

    await updateServiceStatToLastBlock(false, serviceStatPropertyName, toBlock);
    currentBlock += batchSize;
    await timeout(requestDelay);
  }

  console.log("Finished updating all relevant logs.");
}

// Example processing function for 'Registered' logs
async function processRegisteredNode(node: NodeEntry) {
  try {
    await prisma.nodeEntry.create({ data: node });
  } catch (error) {
    console.error("Error registering node:", error);
  }
}

export async function updateServiceStatToLastBlock(
  shouldCreate: boolean,
  serviceStatPropertyName: string,
  lastBlock: number
) {

  const existing = await prisma.serviceStat.findFirst({
    where: { name: serviceStatPropertyName },
  });

  if (!existing || shouldCreate) {
    await prisma.serviceStat.create({
      data: { name: serviceStatPropertyName, value: lastBlock.toString() },
    });
  } else {
    if (lastBlock !== 0) {
      await prisma.serviceStat.update({
        where: { name: serviceStatPropertyName },
        data: { value: lastBlock.toString() },
      });
    }
  }
}

async function getStartData(serviceStatPropertyName: string) {
    const latestBlockNumServiceStat = await prisma.serviceStat.findFirst({
      where: { name: serviceStatPropertyName },
    });
  
    let fromBlock: number = CONTRACT_START_BLOCK;
  
    if (latestBlockNumServiceStat?.value) {
      fromBlock = Number(latestBlockNumServiceStat.value);
    }
  
    if (fromBlock === 0) {
      fromBlock = CONTRACT_START_BLOCK;
    }
  
    return { latestBlockNumServiceStat, fromBlock };
  }
