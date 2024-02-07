import fs from 'fs';
import glob from 'glob';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import path from 'path';
import { BaseContract, Interface, Signer } from 'ethers';
import { config, deployments, ethers, getNamedAccounts } from 'hardhat';
import { ABI, Address, DeployFunction, Deployment as DeploymentData } from 'hardhat-deploy/types';
import { NodeRegistry } from '../components/Contracts';
import Logger from '../utils/Logger';
import { DeploymentNetwork } from './Constants';

const {
  deploy: deployContract,
  execute: executeTransaction,
  getNetworkName,
  save: saveContract,
  getExtendedArtifact,
  run
} = deployments;

interface EnvOptions {
  TEST_FORK?: boolean;
  MAX_FEE: bigint;
  MAX_PRIORITY_FEE: bigint;
}

const { MAX_FEE, MAX_PRIORITY_FEE }: EnvOptions = process.env as any as EnvOptions;
const maxFee = MAX_FEE ? BigInt(MAX_FEE) : undefined;
const maxPriorityFee = MAX_PRIORITY_FEE ? BigInt(MAX_PRIORITY_FEE) : undefined;

export enum NewInstanceName {
  NodeRegistry = 'NodeRegistry'
}

export const InstanceName = {
  ...NewInstanceName
};

export type InstanceName = NewInstanceName;

const deployed = <F extends BaseContract>(name: InstanceName) => ({
  deployed: () => ethers.getContract(name) as any as F
});

const DeployedNewContracts = {
  NodeRegistry: deployed<NodeRegistry>(InstanceName.NodeRegistry)
};

export const DeployedContracts = {
  ...DeployedNewContracts
};

export const isMainnet = () => getNetworkName() === DeploymentNetwork.Mainnet;
export const isBaseSepolia = () => getNetworkName() === DeploymentNetwork.BaseSepolia;
export const isHardhat = () => getNetworkName() === DeploymentNetwork.Hardhat;
export const isTestnet = () => isBaseSepolia(); // ||

export const isLive = () => isMainnet() || isTestnet();

export const getDeploymentDir = () => {
  return path.join(config.paths.deployments, getNetworkName());
};

export const getNamedSigners = async (): Promise<Record<string, Signer>> => {
  const signers: Record<string, Signer> = {};

  for (const [name, address] of Object.entries(await getNamedAccounts())) {
    signers[name] = await ethers.getSigner(address);
  }

  return signers;
};

interface SaveTypeOptions {
  name: InstanceName;
  contract: string;
}

const saveTypes = (options: SaveTypeOptions) => {
  const { name, contract } = options;

  const typechainDir = path.resolve('./', config.typechain.outDir);

  const factoriesSrcDir = path.join(typechainDir, 'factories');

  const typesDir = path.join(getDeploymentDir(), 'types');
  const factoriesDestDir = path.join(typesDir, 'factories');

  if (!fs.existsSync(factoriesDestDir)) {
    fs.mkdirSync(factoriesDestDir, { recursive: true });
  }

  const factoryFilePath = path.join(factoriesSrcDir, `${contract}__factory.ts`);
  if (fs.existsSync(factoryFilePath)) {
    fs.copyFileSync(factoryFilePath, path.join(factoriesDestDir, `${name}__factory.ts`));
  } else {
    console.error(`Factory file not found for contract ${contract}: ${factoryFilePath}`);
  }
};

export interface ArtifactData {
  abi: ABI;
  bytecode: string;
}

interface DeployOptions {
  name: InstanceName;
  contract?: string;
  args?: any[];
  from: string;
  value?: bigint;
  contractArtifactData?: ArtifactData;
  legacy?: boolean;
}

const WAIT_CONFIRMATIONS = isLive() ? 2 : 1;

interface FunctionParams {
  name?: string;
  contractName?: string;
  contractArtifactData?: ArtifactData;
  methodName?: string;
  args?: any[];
}

const logParams = async (params: FunctionParams) => {
  const { name, contractName, contractArtifactData, methodName, args = [] } = params;

  if (!name && !contractArtifactData && !contractName) {
    throw new Error('Either name, contractArtifactData, or contractName must be provided!');
  }

  let contractInterface: Interface;

  if (name) {
    ({ interface: contractInterface } = await ethers.getContract(name));
  } else if (contractArtifactData) {
    contractInterface = new Interface(contractArtifactData!.abi);
  } else {
    ({ interface: contractInterface } = await ethers.getContractFactory(contractName!));
  }

  const fragment = methodName ? contractInterface.getFunction(methodName) : contractInterface.deploy;
  if (!fragment) {
    throw new Error(`Unable to get fragment for ${methodName}`);
  }

  Logger.log(`  ${methodName ?? 'constructor'} params: ${args.length === 0 ? '[]' : ''}`);
  if (args.length === 0) {
    return;
  }

  for (const [i, arg] of args.entries()) {
    const input = fragment.inputs[i];
    Logger.log(`    ${input.name} (${input.type}): ${arg.toString()}`);
  }
};

export const deploy = async (options: DeployOptions) => {
  const { name, contract, from, value, args, contractArtifactData } = options;
  const contractName = contract ?? name;

  const customAlias = contractName === name ? '' : ` as ${name};`;

  Logger.log(`  deploying ${contractName}${customAlias}`);

  await logParams({ contractName, contractArtifactData, args });

  const res = await deployContract(name, {
    contract: contractArtifactData ?? contractName,
    from,
    value: (value ?? '0x0').toString(),
    args,
    maxFeePerGas: maxFee?.toString(),
    maxPriorityFeePerGas: maxPriorityFee?.toString(),
    waitConfirmations: WAIT_CONFIRMATIONS,
    log: true
  });

  const data = { name, contract: contractName };

  saveTypes(data);

  return res.address;
};

interface ExecuteOptions {
  name: InstanceName;
  methodName: string;
  args?: any[];
  from: string;
  value?: bigint;
}

export const execute = async (options: ExecuteOptions) => {
  const { name, methodName, from, value, args } = options;
  const contract = await ethers.getContract(name);

  Logger.info(`  executing ${name}.${methodName} (${await contract.getAddress()})`);

  await logParams({ name, args, methodName });

  return executeTransaction(
    name,
    {
      from,
      value: (value ?? '0x0').toString(),
      maxFeePerGas: maxFee?.toString(),
      maxPriorityFeePerGas: maxPriorityFee?.toString(),
      waitConfirmations: WAIT_CONFIRMATIONS,
      log: true
    },
    methodName,
    ...(args ?? [])
  );
};

interface Deployment {
  name: InstanceName;
  contract?: string;
  address: Address;
  implementation?: Address;
}

export const save = async (deployment: Deployment) => {
  const { name, contract, address } = deployment;

  const contractName = contract ?? name;
  const { abi } = await getExtendedArtifact(contractName);

  // save the deployment json data in the deployments folder
  await saveContract(name, { abi, address });
};

export const deploymentTagExists = (tag: string) => {
  const externalDeployments = config.external?.deployments![getNetworkName()];
  const migrationsPath = path.resolve(
    __dirname,
    '../',
    externalDeployments ? externalDeployments[0] : path.join('deployments', getNetworkName()),
    '.migrations.json'
  );

  if (!fs.existsSync(migrationsPath)) {
    return false;
  }

  const migrations = JSON.parse(fs.readFileSync(migrationsPath, 'utf-8'));
  const tags = Object.keys(migrations).map((tag) => deploymentFileNameToTag(tag));

  return tags.includes(tag);
};

const deploymentFileNameToTag = (filename: string) => Number(path.basename(filename).split('-')[0]).toString();

export const getPreviousDeploymentTag = (tag: string) => {
  const files = fs.readdirSync(config.paths.deploy[0]).sort();

  const index = files.map((f) => deploymentFileNameToTag(f)).lastIndexOf(tag);
  if (index === -1) {
    throw new Error(`Unable to find deployment with tag ${tag}`);
  }

  return index === 0 ? undefined : deploymentFileNameToTag(files[index - 1]);
};

export const getLatestDeploymentTag = () => {
  const files = fs.readdirSync(config.paths.deploy[0]).sort();

  return Number(files[files.length - 1].split('-')[0]).toString();
};

export const deploymentMetadata = (filename: string) => {
  const id = path.basename(filename).split('.')[0];
  const tag = deploymentFileNameToTag(filename);
  const prevTag = getPreviousDeploymentTag(tag);

  return {
    id,
    tag,
    dependency: prevTag
  };
};

export const setDeploymentMetadata = (filename: string, func: DeployFunction) => {
  const { id, tag, dependency } = deploymentMetadata(filename);

  func.id = id;
  func.tags = [tag];
  func.dependencies = dependency ? [dependency] : undefined;

  return func;
};

export const runPendingDeployments = () => {
  const { tag } = deploymentMetadata(getLatestDeploymentTag());

  return run(tag, {
    resetMemory: false,
    deletePreviousDeployments: false,
    writeDeploymentsToFiles: true
  });
};

export const getInstanceNameByAddress = (address: string): InstanceName => {
  const externalDeployments = config.external?.deployments![getNetworkName()];
  const deploymentsPath = externalDeployments ? externalDeployments[0] : path.join('deployments', getNetworkName());

  const deploymentPaths = glob.sync(`${deploymentsPath}/**/*.json`);
  for (const deploymentPath of deploymentPaths) {
    const name = path.basename(deploymentPath).split('.')[0];
    if (name.endsWith('_Implementation') || name.endsWith('_Proxy')) {
      continue;
    }

    const deployment: DeploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    if (deployment.address.toLowerCase() === address.toLowerCase()) {
      return name as InstanceName;
    }
  }

  throw new Error(`Unable to find deployment for ${address}`);
};
