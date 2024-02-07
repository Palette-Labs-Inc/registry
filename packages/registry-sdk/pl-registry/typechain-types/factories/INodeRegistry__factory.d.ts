import { type ContractRunner } from "ethers";
import type { INodeRegistry, INodeRegistryInterface } from "../INodeRegistry";
export declare class INodeRegistry__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "uid";
            readonly type: "bytes32";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "registerer";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "bytes32";
                readonly name: "uid";
                readonly type: "bytes32";
            }, {
                readonly internalType: "string";
                readonly name: "name";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "callbackUrl";
                readonly type: "string";
            }, {
                readonly internalType: "string[]";
                readonly name: "location";
                readonly type: "string[]";
            }, {
                readonly internalType: "string";
                readonly name: "industryCode";
                readonly type: "string";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "enum NodeType";
                readonly name: "nodeType";
                readonly type: "uint8";
            }, {
                readonly internalType: "enum NodeStatus";
                readonly name: "status";
                readonly type: "uint8";
            }];
            readonly indexed: false;
            readonly internalType: "struct NodeEntry";
            readonly name: "node";
            readonly type: "tuple";
        }];
        readonly name: "Registered";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "uid";
            readonly type: "bytes32";
        }];
        readonly name: "getNode";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "bytes32";
                readonly name: "uid";
                readonly type: "bytes32";
            }, {
                readonly internalType: "string";
                readonly name: "name";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "callbackUrl";
                readonly type: "string";
            }, {
                readonly internalType: "string[]";
                readonly name: "location";
                readonly type: "string[]";
            }, {
                readonly internalType: "string";
                readonly name: "industryCode";
                readonly type: "string";
            }, {
                readonly internalType: "address";
                readonly name: "owner";
                readonly type: "address";
            }, {
                readonly internalType: "enum NodeType";
                readonly name: "nodeType";
                readonly type: "uint8";
            }, {
                readonly internalType: "enum NodeStatus";
                readonly name: "status";
                readonly type: "uint8";
            }];
            readonly internalType: "struct NodeEntry";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "name";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "callbackUrl";
                readonly type: "string";
            }, {
                readonly internalType: "string[]";
                readonly name: "location";
                readonly type: "string[]";
            }, {
                readonly internalType: "string";
                readonly name: "industryCode";
                readonly type: "string";
            }, {
                readonly internalType: "enum NodeType";
                readonly name: "nodeType";
                readonly type: "uint8";
            }];
            readonly internalType: "struct RegisterNodeEntryParams";
            readonly name: "entry";
            readonly type: "tuple";
        }];
        readonly name: "registerNode";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): INodeRegistryInterface;
    static connect(address: string, runner?: ContractRunner | null): INodeRegistry;
}
//# sourceMappingURL=INodeRegistry__factory.d.ts.map