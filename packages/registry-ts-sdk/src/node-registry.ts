import {
    NodeRegistry__factory,
    NodeRegistry as NodeRegistryContract,
} from '@palette-labs/registry-contracts/typechain-types';
import { Overrides, TransactionReceipt } from 'ethers';
import { Base, SignerOrProvider, Transaction } from './transaction';
import { ZERO_BYTES32, getNodeUID } from './utils';
import { NodeEntryStruct, RegisterNodeEntryParamsStruct } from '@palette-labs/registry-contracts/typechain-types/INodeRegistry';

// TypeScript representation of the NodeEntry struct from Solidity
export type NodeEntry = {
    uid: string;
    name: string;
    callbackUrl: string;
    location: string[];
    industryCode: string;
    nodeType: NodeType;
    status: NodeStatus;
};

export enum NodeType {
    PSN = 0, // provider supporting node
    BSN = 1, // buyer supporting node
    GP = 2 // gateway provider
}

// Define an enum for the status
export enum NodeStatus {
    INITIATED = 0,
    VERIFIED = 1,
    INVALID = 2
}


export interface GetNodeParams {
    uid: string;
}

export interface NodeRegistryOptions {
    signerOrProvider?: SignerOrProvider;
}

export class NodeRegistry extends Base<NodeRegistryContract> {
    constructor(address: string, options?: NodeRegistryOptions) {
        const { signerOrProvider } = options || {};
        super(new NodeRegistry__factory(), address, signerOrProvider);
    }

    // Returns the version of the contract
    public getVersion(): Promise<string> {
        return this.contract.version();
    }

    // Registers a new node and returns its UID
    public async registerNode(
        { name, callbackUrl, location, industryCode, nodeType }: RegisterNodeEntryParamsStruct,
        overrides?: Overrides
    ): Promise<Transaction<string>> {

        const nodeEntry: RegisterNodeEntryParamsStruct = {
            name,
            callbackUrl,
            location,
            industryCode,
            nodeType,
        };

        const tx = await this.contract.registerNode(nodeEntry, overrides ?? {});

        // eslint-disable-next-line require-await
        return new Transaction(tx, async (_receipt: TransactionReceipt) => 
            getNodeUID(name, callbackUrl, industryCode)
        );
    }

    // Returns an existing node by UID
    public async getNode({ uid }: GetNodeParams): Promise<NodeEntryStruct> {
        const node = await this.contract.getNode(uid);
        if (node.uid === ZERO_BYTES32) {
            throw new Error('Node not found');
        }

        return node;
    }
}
