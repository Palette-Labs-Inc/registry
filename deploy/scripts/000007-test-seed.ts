import fs from 'fs';
import path from 'path';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  execute,
  getDeploymentDir,
  InstanceName,
  isHardhat,
  isTestnet,
  setDeploymentMetadata
} from '../../utils/Deploy';
import Logger from '../../utils/Logger';
import { getNodeUID } from '../../utils/UID'; // Ensure you have this utility function

export const TEST_NODES_OUTPUT_PATH = path.join(getDeploymentDir(), '/test-nodes.json');

// Sample node entries
const NODES = [
  {
    name: 'Node One',
    callbackUrl: 'http://callback.one',
    location: ['882681a339fffff'],
    industryCode: 'FOOD',
    nodeType: 0, // Corresponds to NodeType.PSN, for example
    status: 0 // Corresponds to NodeStatus.UNVERIFIED, for example
  },
  {
    name: 'Node Two',
    callbackUrl: 'http://callback.two',
    location: ['882681a339fffff'],
    industryCode: 'FOOD',
    nodeType: 1, // Corresponds to NodeType.BSN
    status: 0 // Corresponds to NodeStatus.UNVERIFIED
  }
];

const func: DeployFunction = async ({ getNamedAccounts }: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts();
  const registeredNodes = [];

  for (const node of NODES) {
    const { name, callbackUrl, industryCode } = node; 
    const uid = getNodeUID(name,callbackUrl,industryCode);

    await execute({
      name: InstanceName.NodeRegistry,
      methodName: 'registerNode',
      args: [{ ...node, uid }],
      from: deployer
    });

    registeredNodes.push({ ...node, uid });
  }

  // Write registered nodes to JSON file
  fs.writeFileSync(TEST_NODES_OUTPUT_PATH, JSON.stringify(registeredNodes, null, 2));

  Logger.log(`Registered nodes have been saved to ${TEST_NODES_OUTPUT_PATH}`);
};

// Run this deployment script only during test or deployments on testnet
func.skip = async () => !isTestnet() && !isHardhat(); // eslint-disable-line require-await

export default setDeploymentMetadata(__filename, func);
