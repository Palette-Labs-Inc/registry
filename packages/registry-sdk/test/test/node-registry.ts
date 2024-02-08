import { NodeRegistry as NodeRegistryContract } from '@palette-labs/registry-contracts/typechain-types';
import { Signer, encodeBytes32String } from 'ethers';
import { ethers } from 'hardhat';
import { NodeRegistry, NodeStatus, NodeType } from '../../src/node-registry';
import { getNodeUID } from '../../src/utils';
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
      const uid = getNodeUID(name, callbackUrl, industryCode);

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
      expect(nodeEntry.status).to.equal(NodeStatus.INITIATED); // 0n is INITIATED the first value in the enums and initial value of a node upon registration
    };

    it('registerNode method', async () => {
      const node = {
        name: 'Test Node',
        callbackUrl: 'http://testnode.com',
        location: ['882681a339fffff'], // h3 cell index at resolution 8 in Boulder, CO.
        industryCode: 'TEST',
        nodeType: NodeType.PSN,
      };

      await testRegisterNode(node);
    });

    it('should not allow registering the same node twice', async () => {
      const node = {
        name: 'Test Node',
        callbackUrl: 'http://testnode.com',
        location: ['882681a339fffff'], // h3 cell index at resolution 8 in Boulder, CO.
        industryCode: 'TEST',
        nodeType: NodeType.PSN,
      };

      await testRegisterNode(node);
    });

    it('should not allow registering a PSN with empty location', async () => {
      const node = {
        name: 'Test Node 2',
        callbackUrl: 'http://testnode2.com',
        location: [],
        industryCode: 'TEST',
        nodeType: NodeType.PSN,
      };

      await expect(nodeRegistry.registerNode(node)).to.be.revertedWithCustomError(nodeRegistryContract, 'MissingLocation');
    });
  });

  describe('getNode method', () => {
    it('should return a node', async () => {

      const node = {
        name: 'Test Node',
        callbackUrl: 'http://testnode.com',
        location: ['882681a339fffff'], // h3 cell index at resolution 8 in Boulder, CO.
        industryCode: 'TEST',
        nodeType: 0,
      };

      await nodeRegistry.registerNode(node);
      const { name, callbackUrl, industryCode } = node;
      const uid = getNodeUID(name, callbackUrl, industryCode);

      const nodeEntry = await nodeRegistry.getNode({ uid });
      expect(nodeEntry.uid).to.equal(uid);
      expect(nodeEntry.name).to.equal(node.name);
      expect(nodeEntry.callbackUrl).to.equal(node.callbackUrl);
      expect(nodeEntry.industryCode).to.equal(node.industryCode);
      expect(nodeEntry.location).to.deep.equal(node.location);
      expect(nodeEntry.nodeType).to.equal(node.nodeType);
      expect(nodeEntry.owner).to.equal(await sender.getAddress());
      expect(nodeEntry.status).to.equal(NodeStatus.INITIATED);
    });

    it('should throw an error given a non-existing id', async () => {
      try {
        await nodeRegistry.getNode({ uid: encodeBytes32String('BAD') });
        expect.fail('Expected an error to be thrown, but none was.');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).to.equal('Node not found');
        } else {
          expect.fail('The thrown error is not an instance of Error.');
        }
      }
    });
  });



  describe('Signature Header', function () {
    let keyId:string; 
    let nodeRegistry: NodeRegistry;

    before(async () => {
      nodeRegistry = new NodeRegistry(await nodeRegistryContract.getAddress());
      nodeRegistry.connect(sender);

      const node = {
        name: 'Test Node',
        callbackUrl: 'http://testnode.com',
        location: ['882681a339fffff'], // h3 cell index at resolution 8 in Boulder, CO.
        industryCode: 'TEST',
        nodeType: NodeType.PSN,
      };
  
      const tx = await nodeRegistry.registerNode(node);
      keyId = await tx.wait(); 
      console.log('Registered node keyId: ', keyId);
    });

    it('should successfully construct, send, reconstruct, and verify the signature header', async () => {
      const body = { data: 'Example data' };
      const signatureHeader = await nodeRegistry.constructSignatureHeader(body, sender, keyId);
      const isSignatureValid = await nodeRegistry.verifySignatureHeader(signatureHeader, body);
      expect(isSignatureValid).to.be.true;
    });

    it('should fail to verify the signature when the request body is tampered', async () => {
      const originalBody = { data: 'Example data' };
      const tamperedBody = { data: 'Tampered data' }
      const signatureHeader = await nodeRegistry.constructSignatureHeader(originalBody, sender, keyId);

      // Attempt to verify the signature with the tampered body
      const isSignatureValid = await nodeRegistry.verifySignatureHeader(signatureHeader, tamperedBody);
      expect(isSignatureValid).to.be.false;
    });
  });

});