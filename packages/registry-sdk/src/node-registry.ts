import {
    NodeRegistry__factory,
    NodeRegistry as NodeRegistryContract,
} from '@palette-labs/registry-contracts/typechain-types';
import { Overrides, TransactionReceipt, Signer, verifyMessage, keccak256, toUtf8Bytes } from 'ethers';
import { Base, SignerOrProvider, Transaction } from './transaction';
import { ZERO_BYTES32, base64UrlDecode, base64UrlEncode, getNodeUID, parseAuthorizationHeader } from './utils';
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


    public async constructSignatureHeader(body: any, signer: Signer, keyId: string, expirationDurationSeconds: number = 600): Promise<string> {
        const httpBody = JSON.stringify(body);
        const created = Math.floor(Date.now() / 1000); 
        const expires = created + expirationDurationSeconds; 
        const digest = keccak256(toUtf8Bytes(httpBody));
    
        const signingString = `created: ${created}\nexpires: ${expires}\ndigest: ${digest}`;
        const signature = await signer.signMessage(signingString);
        const encodedSignature = base64UrlEncode(signature);
    
        const algorithm = "ecdsa-p256-keccak256";
        const headers = "(created) (expires) digest";
        const authorizationHeader = `Signature keyId="${keyId}",algorithm="${algorithm}",created="${created}",expires="${expires}",headers="${headers}",signature="${encodedSignature}"`;
    
        return authorizationHeader;
    }
    
    public async verifySignatureHeader(
        authorizationHeader: string,
        body: any,
    ): Promise<boolean> {
        const { signature, created, expires, keyId } = parseAuthorizationHeader(authorizationHeader);
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > expires) {
            console.error("Message has expired.");
            return false;
        }
    
        const expectedSigner = await this.getNode({ uid: keyId });
    
        const httpBody = JSON.stringify(body);
        const digest = keccak256(toUtf8Bytes(httpBody));

        // Reconstructing the signing string exactly as it was during signing
        const signingString = `created: ${created}\nexpires: ${expires}\ndigest: ${digest}`;
        const decodedSignature = base64UrlDecode(signature);
    
        try {
            // Verifying the signature against the reconstructed signing string
            const recoveredAddress = verifyMessage(signingString, decodedSignature);
            console.log('Recovered Address:', recoveredAddress);
            console.log('Expected Address:', expectedSigner.owner);
    
            return recoveredAddress.toLowerCase() === expectedSigner.owner.toString().toLowerCase();
        } catch (error) {
            console.error("Signature verification failed:", error);
            // return NACK.
            return false;
        }
    }
}
