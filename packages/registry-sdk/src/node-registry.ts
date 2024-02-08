import {
    NodeRegistry__factory,
    NodeRegistry as NodeRegistryContract,
} from '@palette-labs/registry-contracts/typechain-types';
import { Overrides, TransactionReceipt, keccak256, toUtf8Bytes, Signer, verifyMessage } from 'ethers';
import { Base, SignerOrProvider, Transaction } from './transaction';
import { ZERO_BYTES32, base64UrlDecode, base64UrlEncode, getNodeUID } from './utils';
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


export interface SignatureHeader {
    keyId: string;
    algorithm: string;
    created: number;
    expires: number;
    headers: string;
    signature: string;
}

function parseSignatureHeader(signatureHeader: string): SignatureHeader {
    const parts = signatureHeader.split(',').map(part => part.trim());
    const parsed = parts.reduce((acc: any, part) => {
        const [key, value] = part.split('=');
        if (key && value) {
            acc[key] = value.replace(/"/g, '');
        }
        return acc;
    }, {});

    parsed.created = parseInt(parsed.created, 10);
    parsed.expires = parseInt(parsed.expires, 10);

    if (!parsed.headers.includes('(created)') || !parsed.headers.includes('(expires)') || !parsed.headers.includes('digest')) {
        throw new Error('Missing required headers in the signature');
    }

    return parsed;
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

    public async constructSignatureHeader(url: string, method: string, body: any, signer:Signer, node:NodeEntryStruct, expirationSeconds: number = 600) {
        const httpBody = JSON.stringify(body);
        const digest = keccak256(toUtf8Bytes(httpBody));
        const created = Math.floor(Date.now() / 1000); // creation as unix timestamp
        const expires = created + expirationSeconds;
    
        const signingString = `method: ${method}\npath: ${url}\n(created): ${created}\n(expires): ${expires}\ndigest: KECCAK256=${digest}`;
        const signature = await signer.signMessage(signingString);
        const encodedSignature = base64UrlEncode(signature);

        const { name, callbackUrl, industryCode } = node;
        const keyId = getNodeUID(name,callbackUrl,industryCode);
    
        const authorizationHeader = `Signature keyId="${keyId}",algorithm="ecdsa-p256-keccak256",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${encodedSignature}"`;
        return authorizationHeader;
    }

    public async verifySignatureHeader(
        signatureHeader: string,
        method: string,
        url: string,
        body: any,
    ): Promise<boolean> {
        const parsedHeader = parseSignatureHeader(signatureHeader);
        const httpBody = JSON.stringify(body);
        const digest = keccak256(toUtf8Bytes(httpBody));

        // reconstruct the signingString
        const signingString = `method: ${method}\npath: ${url}\n(created): ${parsedHeader.created}\n(expires): ${parsedHeader.expires}\ndigest: KECCAK256=${digest}`;
    
        // Verify the signature
        const decodedSignature = base64UrlDecode(parsedHeader.signature); 
        
        try {
            const signerAddress = verifyMessage(signingString, decodedSignature);
            console.log('signerAddress:',signerAddress);
            
            return true;
        } catch (error) {
            console.error("Signature verification failed:", error);
            return false;
        }
    }
}
