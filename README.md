## Network Registry Infrastructure
We are designing a federated, server-to-server architecture for commercial markets. The design supports an interoperable network of independently hosted `Provider Supporting Servers` and `Buyer Supporting Servers` that are responsible for onboarding participants on either side of the network.

The network registry is a decentralized public ledger that maintains the records of Node Operators (network servers), agents, their supported Industry Codes, and the geographical regions that they represent. The registry is queried for a Producers products or services during the search phase of a Buyers transaction lifecycle. 

During registration into the network, a Node Operator creates an ethereum key pair. The public key is stored on the blockchain in the network registry along with a unique identifier. When communicating with other Node's in the network, a *sending* Node Operator signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, they should query the registry for the *sending* Node's public key and use the signature in the request header to decrypt the message. If the message is successfully decrypted, the *receiving* Node Operator can know that the *sending* Node Operator is VERIFIED and properly registered. If the *sending* Node Operator's message is unable to be decrypted, the *receiving* Node Operator should respond to the *sending* Node Operators request with an error code. 

All registered Node Operators self-maintain a `location` field in the registry table. The location field supports an array of strings that represent a [`Hexagonal Hierarchical Spatial Index`](https://github.com/uber/h3). 

### Requirements
Design the network registry, submit it as a PR to this repository, and share a link to the [deployed registry contract to base-sepolia using hardhat](https://docs.base.org/guides/deploy-smart-contracts/). You can follow the same general repository structure as The [Ethereum Attestation Service](https://github.com/ethereum-attestation-service/eas-contracts/tree/master).

1. A smart contract for the network registry written in solidity
2. A fork of the [EAS indexing service](https://github.com/ethereum-attestation-service/eas-indexing-service) and GraphQL resolver to index and maintain the registry infrastructure w/ [PostgreSQL bindings for the H3 Core Library](https://github.com/zachasme/h3-pg) bindings

### NodeEntry example data structure.
Each entry in the registry will follow this general structure.
```sol
struct NodeEntry {
    bytes32 uid; // Unique identifier
    address owner; // the eth address of the registrant.
    string name; // Name of the node
    string callbackUrl; // Callback URL of the server for the node
    string[] location; // Array of h3 strings for the supported location
    string industryCode; // Industry code
    NodeType nodeType; // Type of the node (PSN or BSN)
    NodeStatus status; // Status of the node (VERIFIED or UNVERIFIED)
}
```

### Included Methods
- `registerNode` - a public method to add an entry to the registry. Only requirement is a valid ethereum key pair
- `getNode` - a public method to retrieve an entry by the ID of the entry
- `getNodeCount` - a public method to retrieve the count of all of the existing node entries
- `updateNode` - a method mutable only by the owner of the entry
- `deleteNode` - a method mutable only by the owner of the entry

### Project structure
The expected structure is based off of the The [Ethereum Attestation Service](https://github.com/ethereum-attestation-service/eas-contracts/tree/master) folder structure. Use this structure as an outline for the repository
- `/contracts` - contains data structure definitions and core registry contract
- `/tests`  - contains unit tests in typescript for each of the included methods
- `/deploy/scripts` - deployment methods in typescript for each 
- `/deploy/tests` - deployment unit tests in typescript
- `/deployments/base-sepolia` - contains data related to the deployment of the contract on the base-sepolia network
- `/utils` - utility functions for contract deployment

### Tests
- use the [chai assertion library](https://www.chaijs.com/) to write unit tests for each method of the registry contract in typescript.

### Resource 
- The [Ethereum Attestation Service](https://github.com/ethereum-attestation-service/eas-contracts/tree/master) provides a good overview of dealing with different data structures in solidity smart contracts
- The [EAS indexing service](https://github.com/ethereum-attestation-service/eas-indexing-service)
- Uber [Hexagonal Hierarchical Spatial Index](https://github.com/uber/h3) repository and [PostgreSQL bindings for the H3 Core Library](https://github.com/zachasme/h3-pg) bindings to include in the registry indexer. 
- [Chai assertion library](https://www.chaijs.com/) for unit tests.
- [Template contract definition](./INodeRegistry.sol) can be found in the `INodeRegistry.sol` file.
- [Hardhat](https://hardhat.org/) 


Contact [mike](mailto:mike@noshdelivery.co) if you have questions about the structure of the registry table.