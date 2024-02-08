# registry


## Deployments
#### Base Sepolia

Version 0.0.1:
* **NodeRegistry**:
  * Contract: [0x56e3B524302Ec60Ec7850aF492D079367E03e5fb](https://sepolia.basescan.org/address/0x56e3B524302Ec60Ec7850aF492D079367E03e5fb)
  * Deployment and ABI: [NodeRegistry.json](./packages/registry-contracts/deployments/base-sepolia/NodeRegistry.json)

## Repository structure

### [registry-contracts](./packages/registry-contracts/README.md)
Contains methods for registering and retrieving nodes.

#### Features:
- smart contracts for node registration and retrieval.
- example registry contract and deployment information on base-sepolia.
- unit tests using the Chai assertion framework and Hardhat for development and testing.

### [registry-sdk](./packages/registry-sdk//README.md)
Provides a typed interface and SDK for interacting with the `registry-contracts`. Additionally, the sdk adds functionality to support header signing and verification for server-to-server communication within the network.

#### Features:
- typed interface to interact with registry-contracts.
- authorization header signing and verification methods for secure communication during server-to-server requests on the network.

## Getting Started 

### Setting Up Your Environment
Before diving into development or deployment, ensure your environment is correctly set up by following these steps:

#### Environment Requirements: 
Begin by reviewing the `.env.template` file in `registry-contracts` to understand the required environment variables. 

#### Navigate to Registry Contracts: 
Change your directory to the registry contracts package to work with the smart contracts.

```sh
cd packages/registry-contracts
```

#### Recompile Contracts: 
If you need to recompile the contract and associated typechain types, particularly after making changes to `/contracts/NodeRegistry.sol`, run:

```sh
yarn recompile
```

This ensures that your contracts and TypeScript bindings are up to date.

#### Run Unit Tests: 
It's crucial to run unit tests after making any edits to the smart contracts to ensure that all functionalities work as expected.


```sh
yarn test
```
#### Test Contract Deployment: 
Before an official release, test the deployment process of the contract to catch any potential issues early.

```sh
yarn test:deploy
```

### Preparing for Release: 
To prepare your contract for a release and ensure a smooth deployment process, follow these steps:

#### Setup Your Wallet: 
The deployment process requires access to a wallet with sufficient funds on the base-sepolia network. Follow [these instructions](https://www.coinbase.com/wallet) for setting up your wallet. Verify that your `.env` file includes the private key for the wallet responsible for deploying the contract.

#### Prepare for Release: 
Run the following command to prepare your contract for release. This step might involve flattening the contract, verifying dependencies, or other pre-deployment checks.

```sh
yarn prepare:release
```

#### Deploy Your Contract:
With your environment set up and your wallet prepared, you're ready to deploy your contract to the base-sepolia network. Execute the deployment command:

```sh
yarn deploy:base-sepolia
```
Pay close attention to the output of this command, especially the address where the NodeRegistry contract is deployed. This address is necessary for interacting with the contract post-deployment and for configuring the SDK.


## About the Network Registry Infrastructure
We are designing a federated, server-to-server architecture for commercial markets. The design supports an interoperable network of independently hosted `Provider Supporting Servers` and `Buyer Supporting Servers` that are responsible for onboarding participants on either side of the network.

The network registry is a decentralized public ledger that maintains the records of Node Operators (network servers), agents, their supported Industry Codes, and the geographical regions that they represent. The registry is queried for a Producers products or services during the search phase of a Buyers transaction lifecycle. 

During registration into the network, a Node Operator creates an ethereum key pair. The public key is stored on the blockchain in the network registry along with a unique identifier. When communicating with other Node's in the network, a *sending* Node Operator signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, they should query the registry for the *sending* Node's public key and use the signature in the request header to decrypt the message. If the message is successfully decrypted, the *receiving* Node Operator can know that the *sending* Node Operator is VERIFIED and properly registered. If the *sending* Node Operator's message is unable to be decrypted, the *receiving* Node Operator should respond to the *sending* Node Operators request with an error code. 

All registered Node Operators self-maintain a `location` field in the registry table. The location field supports an array of strings that represent a [`Hexagonal Hierarchical Spatial Index`](https://github.com/uber/h3). 


## Dealing with Location Data
The [H3 positioning system](https://github.com/uber/h3)is a geospatial indexing system using a hexagonal grid that can be (approximately) subdivided into finer and finer hexagonal grids, combining the benefits of a hexagonal grid with [S2](https://code.google.com/archive/p/s2-geometry-library/)'s hierarchical subdivisions. Each hexagonal cell is identified by an H3 index that enables efficient storage, querying, and processing of geospatial data. H3 offers the protocol a flexible and precise geospatial standard with prebuilt bindings for a wide range of programming languages like [Java](https://github.com/uber/h3-java), [JavaScript](https://github.com/uber/h3-js), [Python](https://github.com/uber/h3-py), and [others](https://h3geo.org/docs/community/bindings) are available.

During the discovery phase of a `Buyers` transaction lifecycle, the registry is queried for `PSNs` that can offer products and services that fit the search criteria. The H3 system allows for a `BSN` to query the registry for `PSNs` offering nearby services during the discovery phase of the `Buyers` transaction lifecycle, offering local networks the opportunity to transact when there is a geographic restriction to the nature of the transaction; such as in food delivery or rideshare. 

The H3 standard also allows the protocol to have a holonic structure that naturally scales to the needs of different industries and urban densities, making for a flexible, dynamic, and precise standard for location-specific commercial transactions.

`PSNs` should establish H3 indexes based on the Providers that they represent; translating the self-defined serviceable regions of their Providers to an H3 index that is stored in the registry as an array of strings. Each of these strings represents a hexagonal cell that if queried, should return at lease a single Provider able to commence in a transaction.

For more on generating indexes, see [the h3 GitHub repository](https://github.com/uber/h3?tab=readme-ov-file) 