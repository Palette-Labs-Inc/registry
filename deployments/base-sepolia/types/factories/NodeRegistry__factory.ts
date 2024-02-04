/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { NodeRegistry, NodeRegistryInterface } from "../NodeRegistry";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "uid",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "registerer",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "callbackUrl",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "location",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "industryCode",
            type: "string",
          },
          {
            internalType: "enum NodeType",
            name: "nodeType",
            type: "uint8",
          },
          {
            internalType: "enum NodeStatus",
            name: "status",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct NodeEntry",
        name: "node",
        type: "tuple",
      },
    ],
    name: "Registered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "uid",
        type: "bytes32",
      },
    ],
    name: "getNode",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "callbackUrl",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "location",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "industryCode",
            type: "string",
          },
          {
            internalType: "enum NodeType",
            name: "nodeType",
            type: "uint8",
          },
          {
            internalType: "enum NodeStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct NodeEntry",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "callbackUrl",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "location",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "industryCode",
            type: "string",
          },
          {
            internalType: "enum NodeType",
            name: "nodeType",
            type: "uint8",
          },
          {
            internalType: "enum NodeStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct NodeEntry",
        name: "entry",
        type: "tuple",
      },
    ],
    name: "registerNode",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60e060405234801561001057600080fd5b506000608081905260a052600160c05260805160a05160c05161119e61004f6000396000610724015260006106fb015260006106d2015261119e6000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80634675c4391461004657806350c946fe1461006c57806354fd4d501461008c575b600080fd5b610059610054366004610a65565b6100a1565b6040519081526020015b60405180910390f35b61007f61007a366004610aa7565b6103a2565b6040516100639190610b98565b6100946106cb565b6040516100639190610c9a565b6000806040518060e001604052806000801b81526020018480602001906100c89190610cad565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050509082525060200161010f6040860186610cad565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050908252506020016101566060860186610d19565b61015f91610dff565b81526020016101716080860186610cad565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050908252506020016101bb60c0860160a08701610eff565b60018111156101cc576101cc610b2e565b81526020016101e160e0860160c08701610eff565b60018111156101f2576101f2610b2e565b9052905060006102018261076e565b6000818152602081905260409020549091501561024a576040517f23369fa600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b808252600081815260208181526040909120835181559083015183919060018201906102769082610fbe565b506040820151600282019061028b9082610fbe565b50606082015180516102a7916003840191602090910190610950565b50608082015160048201906102bc9082610fbe565b5060a08201516005820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600183818111156102fd576102fd610b2e565b021790555060c08201516005820180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1661010083600181111561034457610344610b2e565b02179055509050503373ffffffffffffffffffffffffffffffffffffffff16817f03a33a72ef165f76b1458e73cff0dfff89fc44d28bc8334c489b77e4468c459b846040516103939190610b98565b60405180910390a39392505050565b6103aa6109a6565b60008281526020818152604091829020825160e081019093528054835260018101805491928401916103db90610f1c565b80601f016020809104026020016040519081016040528092919081815260200182805461040790610f1c565b80156104545780601f1061042957610100808354040283529160200191610454565b820191906000526020600020905b81548152906001019060200180831161043757829003601f168201915b5050505050815260200160028201805461046d90610f1c565b80601f016020809104026020016040519081016040528092919081815260200182805461049990610f1c565b80156104e65780601f106104bb576101008083540402835291602001916104e6565b820191906000526020600020905b8154815290600101906020018083116104c957829003601f168201915b5050505050815260200160038201805480602002602001604051908101604052809291908181526020016000905b828210156105c057838290600052602060002001805461053390610f1c565b80601f016020809104026020016040519081016040528092919081815260200182805461055f90610f1c565b80156105ac5780601f10610581576101008083540402835291602001916105ac565b820191906000526020600020905b81548152906001019060200180831161058f57829003601f168201915b505050505081526020019060010190610514565b5050505081526020016004820180546105d890610f1c565b80601f016020809104026020016040519081016040528092919081815260200182805461060490610f1c565b80156106515780601f1061062657610100808354040283529160200191610651565b820191906000526020600020905b81548152906001019060200180831161063457829003601f168201915b5050509183525050600582015460209091019060ff16600181111561067857610678610b2e565b600181111561068957610689610b2e565b81526020016005820160019054906101000a900460ff1660018111156106b1576106b1610b2e565b60018111156106c2576106c2610b2e565b90525092915050565b60606106f67f00000000000000000000000000000000000000000000000000000000000000006107ae565b61071f7f00000000000000000000000000000000000000000000000000000000000000006107ae565b6107487f00000000000000000000000000000000000000000000000000000000000000006107ae565b60405160200161075a939291906110d8565b604051602081830303815290604052905090565b60008160200151826040015183608001516040516020016107919392919061114e565b604051602081830303815290604052805190602001209050919050565b606060006107bb8361086d565b600101905060008167ffffffffffffffff8111156107db576107db610d81565b6040519080825280601f01601f191660200182016040528015610805576020820181803683370190505b5090508181016020015b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff017f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a850494508461080f575b509392505050565b6000807a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000083106108b6577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000830492506040015b6d04ee2d6d415b85acef810000000083106108e2576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc10000831061090057662386f26fc10000830492506010015b6305f5e1008310610918576305f5e100830492506008015b612710831061092c57612710830492506004015b6064831061093e576064830492506002015b600a831061094a576001015b92915050565b828054828255906000526020600020908101928215610996579160200282015b8281111561099657825182906109869082610fbe565b5091602001919060010190610970565b506109a29291506109f6565b5090565b6040518060e001604052806000801916815260200160608152602001606081526020016060815260200160608152602001600060018111156109ea576109ea610b2e565b81526020016000905290565b808211156109a2576000610a0a8282610a13565b506001016109f6565b508054610a1f90610f1c565b6000825580601f10610a2f575050565b601f016020900490600052602060002090810190610a4d9190610a50565b50565b5b808211156109a25760008155600101610a51565b600060208284031215610a7757600080fd5b813567ffffffffffffffff811115610a8e57600080fd5b820160e08185031215610aa057600080fd5b9392505050565b600060208284031215610ab957600080fd5b5035919050565b60005b83811015610adb578181015183820152602001610ac3565b50506000910152565b60008151808452610afc816020860160208601610ac0565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60028110610b94577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b9052565b600060208083528351818401528084015160e06040850152610bbe610100850182610ae4565b905060408501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe080868403016060870152610bfa8383610ae4565b60608801518782038301608089015280518083529194508501925084840190600581901b8501860160005b82811015610c515784878303018452610c3f828751610ae4565b95880195938801939150600101610c25565b5060808a01519650838982030160a08a0152610c6d8188610ae4565b965050505050505060a0840151610c8760c0850182610b5d565b5060c084015161086560e0850182610b5d565b602081526000610aa06020830184610ae4565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610ce257600080fd5b83018035915067ffffffffffffffff821115610cfd57600080fd5b602001915036819003821315610d1257600080fd5b9250929050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610d4e57600080fd5b83018035915067ffffffffffffffff821115610d6957600080fd5b6020019150600581901b3603821315610d1257600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715610df757610df7610d81565b604052919050565b600067ffffffffffffffff80841115610e1a57610e1a610d81565b8360051b6020610e2b818301610db0565b868152918501918181019036841115610e4357600080fd5b865b84811015610ee657803586811115610e5d5760008081fd5b8801601f3681830112610e705760008081fd5b813588811115610e8257610e82610d81565b610eb1877fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08484011601610db0565b91508082523687828501011115610ec85760008081fd5b80878401888401376000908201870152845250918301918301610e45565b50979650505050505050565b60028110610a4d57600080fd5b600060208284031215610f1157600080fd5b8135610aa081610ef2565b600181811c90821680610f3057607f821691505b602082108103610f69577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b601f821115610fb957600081815260208120601f850160051c81016020861015610f965750805b601f850160051c820191505b81811015610fb557828155600101610fa2565b5050505b505050565b815167ffffffffffffffff811115610fd857610fd8610d81565b610fec81610fe68454610f1c565b84610f6f565b602080601f83116001811461103f57600084156110095750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610fb5565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b8281101561108c5788860151825594840194600190910190840161106d565b50858210156110c857878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b600084516110ea818460208901610ac0565b80830190507f2e000000000000000000000000000000000000000000000000000000000000008082528551611126816001850160208a01610ac0565b60019201918201528351611141816002840160208801610ac0565b0160020195945050505050565b60008451611160818460208901610ac0565b845190830190611174818360208901610ac0565b8451910190611187818360208801610ac0565b019594505050505056fea164736f6c6343000813000a";

type NodeRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NodeRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NodeRegistry__factory extends ContractFactory {
  constructor(...args: NodeRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      NodeRegistry & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): NodeRegistry__factory {
    return super.connect(runner) as NodeRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NodeRegistryInterface {
    return new Interface(_abi) as NodeRegistryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): NodeRegistry {
    return new Contract(address, _abi, runner) as unknown as NodeRegistry;
  }
}
