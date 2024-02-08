import { config } from 'dotenv';
config(); // This loads the .env file at the root of your project into process.env

import { getNodeUID, NodeRegistry} from "@palette-labs/registry-sdk";
import { ethers, JsonRpcProvider } from 'ethers';


/** TEST NODE
 * Retrieved node: Result(8) [
  '0xfd71b914f49331197fd1d14d2f5ab68884dac50d9069b94b927c4d38565df0e3',
  'Example Node 2',
  'http://example2.com/callback',
  Result(1) [ '882681a339fffff' ],
  'EX',
  '0xd443dDeeC8cD386B6d592b82853738490798922a',
  0n,
  0n
]
 */

/*
const register = async () => {
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";

    // Setup provider and signer using environment variables
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL; // Using Sepolia as an example
    const privateKey = process.env.SIGNER!; // Assuming DEPLOYER is your private key env variable name
    const provider = new JsonRpcProvider(providerUrl);

    const signer = new ethers.Wallet(privateKey, provider);

    // Instantiate the NodeRegistry SDK and connect it with the signer
    const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress);
    nodeRegistry.connect(signer);

    // Define a new node to register
    const newNode = {
        name: "Example Node 2",
        callbackUrl: "http://example2.com/callback",
        location: ["882681a339fffff"], // Example location
        industryCode: "EX",
        nodeType: 0, // Assuming 0 corresponds to PSN
    };

    console.log("Registering a new node...");

    // Register the new node
    try {
        const transaction = await nodeRegistry.registerNode(newNode);
        await transaction.wait(); // Optionally wait for the transaction to be mined

        const uid = await transaction.wait()

        console.log(`Node registered with UID: ${uid}`);

        // Retrieve the registered node by UID
        console.log("Retrieving the registered node...");
        
        const nodeEntry = await nodeRegistry.getNode({ uid });
        console.log("Retrieved node:", nodeEntry);
    } catch (error) {
        console.error("Error during node registration or retrieval:", error);
    }
};




const getNodeDuration = async (nodeRegistry: NodeRegistry) => {
    const uid = '0x6da4e3a839151079116291a9bac3eb762d353e08b08f83ba37af8bf588fd90a1';

    try {
        const startTime = Date.now(); 
        await nodeRegistry.getNode({ uid });
        const duration = Date.now() - startTime; 
        return duration; 
    } catch (error) {
        console.error("Error during node retrieval:", error);
        return 0;
    }
};


const testNodeQueryTime = async () => {
    // nodeRegistryContractAddress is from yarn deploy:base-sepolia - see README in registry-contracts for the latest address.
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL; 
    const privateKey = process.env.SIGNER!; 
    const provider = new JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress);
    nodeRegistry.connect(signer);

    let totalDuration = 0;
    const numberOfQueries = 100;

    const progressBarLength = 20; // Length of the progress bar

    for (let i = 0; i < numberOfQueries; i++) {
        const duration = await getNodeDuration(nodeRegistry);
        totalDuration += duration;

        const progress = Math.round(((i + 1) / numberOfQueries) * progressBarLength);
         const filledBar = '|'.repeat(progress);
         const emptyBar = '.'.repeat(progressBarLength - progress);
         process.stdout.write(`\rProgress: [${filledBar}${emptyBar}] ${i + 1}/${numberOfQueries}`);
     }

     console.log("\nDone."); 

    const averageDuration = totalDuration / numberOfQueries;
    console.log(`\nAverage query time: ${averageDuration} ms`);
};


async function testVerifySignature() {
    const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";
    const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL!;
    const privateKey = process.env.SIGNER!;
    const provider = new JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress, { signerOrProvider: signer });

    // unique details of a registered node.
    const nodeName = 'Example Node 2'
    const nodeCallbackUrl = 'http://example2.com/callback'
    const nodeIndustry = 'EX'
    const registeredNodeId = getNodeUID(nodeName,nodeCallbackUrl,nodeIndustry)

    console.log('registedNodeId:',registeredNodeId);

    const body = { data: 'Example data' };
    const signature = await nodeRegistry.constructSignatureHeader(body, signer, registeredNodeId);

    // const tampered_body = { data: 'Example data 12323' };
    const isSignatureValid = await nodeRegistry.verifySignatureHeader(signature,body);


    if (isSignatureValid) {
        console.log('Signature verification succeeded.');
    } else {
        console.error('Signature verification failed.');
    }
}

// testNodeQueryTime().catch(console.error);
// register().catch(console.error);
testVerifySignature().catch(console.error);

*/