import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common";
export type NodeEntryStruct = {
    uid: BytesLike;
    name: string;
    callbackUrl: string;
    location: string[];
    industryCode: string;
    owner: AddressLike;
    nodeType: BigNumberish;
    status: BigNumberish;
};
export type NodeEntryStructOutput = [
    uid: string,
    name: string,
    callbackUrl: string,
    location: string[],
    industryCode: string,
    owner: string,
    nodeType: bigint,
    status: bigint
] & {
    uid: string;
    name: string;
    callbackUrl: string;
    location: string[];
    industryCode: string;
    owner: string;
    nodeType: bigint;
    status: bigint;
};
export type RegisterNodeEntryParamsStruct = {
    name: string;
    callbackUrl: string;
    location: string[];
    industryCode: string;
    nodeType: BigNumberish;
};
export type RegisterNodeEntryParamsStructOutput = [
    name: string,
    callbackUrl: string,
    location: string[],
    industryCode: string,
    nodeType: bigint
] & {
    name: string;
    callbackUrl: string;
    location: string[];
    industryCode: string;
    nodeType: bigint;
};
export interface INodeRegistryInterface extends Interface {
    getFunction(nameOrSignature: "getNode" | "registerNode"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Registered"): EventFragment;
    encodeFunctionData(functionFragment: "getNode", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "registerNode", values: [RegisterNodeEntryParamsStruct]): string;
    decodeFunctionResult(functionFragment: "getNode", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerNode", data: BytesLike): Result;
}
export declare namespace RegisteredEvent {
    type InputTuple = [
        uid: BytesLike,
        registerer: AddressLike,
        node: NodeEntryStruct
    ];
    type OutputTuple = [
        uid: string,
        registerer: string,
        node: NodeEntryStructOutput
    ];
    interface OutputObject {
        uid: string;
        registerer: string;
        node: NodeEntryStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface INodeRegistry extends BaseContract {
    connect(runner?: ContractRunner | null): INodeRegistry;
    waitForDeployment(): Promise<this>;
    interface: INodeRegistryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getNode: TypedContractMethod<[
        uid: BytesLike
    ], [
        NodeEntryStructOutput
    ], "view">;
    registerNode: TypedContractMethod<[
        entry: RegisterNodeEntryParamsStruct
    ], [
        string
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getNode"): TypedContractMethod<[uid: BytesLike], [NodeEntryStructOutput], "view">;
    getFunction(nameOrSignature: "registerNode"): TypedContractMethod<[
        entry: RegisterNodeEntryParamsStruct
    ], [
        string
    ], "nonpayable">;
    getEvent(key: "Registered"): TypedContractEvent<RegisteredEvent.InputTuple, RegisteredEvent.OutputTuple, RegisteredEvent.OutputObject>;
    filters: {
        "Registered(bytes32,address,tuple)": TypedContractEvent<RegisteredEvent.InputTuple, RegisteredEvent.OutputTuple, RegisteredEvent.OutputObject>;
        Registered: TypedContractEvent<RegisteredEvent.InputTuple, RegisteredEvent.OutputTuple, RegisteredEvent.OutputObject>;
    };
}
//# sourceMappingURL=INodeRegistry.d.ts.map