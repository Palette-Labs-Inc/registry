import { NodeRegistry as NodeRegistryContract } from '@palette-labs/registry-contracts/typechain-types';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { NodeRegistry, NodeType, NodeStatus } from '../../src/node-registry';
import { ZERO_BYTES32, getNodeUID } from '../../src/utils';
import Contracts from '../components/Contracts';
import chai from './helpers/chai';
import { RegisterNodeEntryParamsStruct } from '@palette-labs/registry-contracts/typechain-types/INodeRegistry';

const { expect } = chai;

describe('NodeRegistry API', () => {
  let accounts: Signer[];
  let sender: Signer;

  let nodeRegistryContract: NodeRegistryContract;
  let nodeRegistry: NodeRegistry;

  before(async () => {
    accounts = await ethers.getSigners();
    [sender] = accounts;
  });

  beforeEach(async () => {
    nodeRegistryContract = await Contracts.NodeRegistry.deploy();
    nodeRegistry = new NodeRegistry(await nodeRegistryContract.getAddress());
    nodeRegistry.connect(sender);
  });

  describe('construction', () => {
    it('should properly create a NodeRegistry API', async () => {
      expect(await nodeRegistry.getVersion()).to.equal(await nodeRegistryContract.version());
    });
  });

  describe('node registration', () => {
    const testRegisterNode = async (node: RegisterNodeEntryParamsStruct) => {
      const { name, callbackUrl, industryCode } = node;
      const uid = getNodeUID(name,callbackUrl,industryCode);

      await expect(nodeRegistry.getNode({ uid })).to.be.rejectedWith('Node not found');

      const tx = await nodeRegistry.registerNode(node);
      const uid2 = await tx.wait();

      const nodeEntry = await nodeRegistry.getNode({ uid });
      expect(nodeEntry.uid).to.equal(uid);
      expect(nodeEntry.uid).to.equal(uid2);
      expect(nodeEntry.name).to.equal(node.name);
      expect(nodeEntry.callbackUrl).to.equal(node.callbackUrl);
      expect(nodeEntry.industryCode).to.equal(node.industryCode);
      expect(nodeEntry.location).to.deep.equal(node.location);
      expect(nodeEntry.nodeType).to.equal(node.nodeType);
      expect(nodeEntry.owner).to.equal(await sender.getAddress());
      expect(nodeEntry.status).to.equal(0n); // 0n is INITIATED the first value in the enums and initial value of a node upon registration
    };

    it('should not allow registering a node with existing uid', async () => {
        const node = {
          uid: ZERO_BYTES32,
          name: 'Test Node',
          callbackUrl: 'http://testnode.com',
          location: ['882681a339fffff'], // h3 cell index at resolution 8 in Boulder, CO.
          industryCode: 'TEST',
          nodeType: NodeType.PSN, 
          status: NodeStatus.VERIFIED // TODO: registered nodes should automatically have a pending status.
        };
        
        await testRegisterNode(node);
      });
  });
});