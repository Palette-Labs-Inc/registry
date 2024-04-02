# RFC: Node Registry Infrastructure

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-30-2024
- **Last supportd:** 03-30-2024

## Abstract
This document outlines a proposal for a decentralized node registry infrastructure. This proposal advocates for permissionless registration into an EVM compatible blockchain, leveraging existing cryptographic standards (`secp256k1` for signing and `keccak256` for hashing) to simplify inter-service communication.

### Motivation
The motivation behind this proposal is to overcome the limitations of centralized registries and to ensure that server-to-server communication in a distributed network can be reliably verified.

## Introduction

### About the Node Registry Infrastructure
We are designing an open protocol for commercial markets. The design supports an interoperable network of independently hosted `Provider Supporting Nodes (PSN)` and `Buyer Supporting Nodes (BSN)` that are responsible for onboarding participants on either side of a two-sided market. PSNs and BSNs are both `Personal Data Stores` that specialize in storing and interfacing with different services related to `Buyers` or `Providers` respectively. 

The node registry is a decentralized public ledger that maintains the records of `PDS`s (network servers), their supported Industry Codes, and the geographical regions that they represent. The node registry is queried for a Producers products or services during the search phase of a Buyers transaction lifecycle.

During registration into the network, a `Personal Data Store` creates an ethereum key pair. The public key is stored on the blockchain in the node registry along with a unique identifier. When communicating with other Node's in the network, a *sending* `Personal Data Store` signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, they should query the registry for the *sending* Node's public key and use the signature in the request header to decrypt the message. If the message is successfully decrypted, the *receiving* `Personal Data Store` can know that the *sending* `Personal Data Store` is VERIFIED and properly registered. If the *sending* `Personal Data Store`'s message is unable to be decrypted, the *receiving* `Personal Data Store` should respond to the *sending* `Personal Data Store`s request with an error code. 

All registered `Personal Data Store`s self-maintain a `location` field in the registry table. The location field supports an array of strings that represent a [`Hexagonal Hierarchical Spatial Index`](https://github.com/uber/h3). 

## Proposal

### Dealing with Location Data
The [H3 positioning system](https://github.com/uber/h3)is a geospatial indexing system using a hexagonal grid that can be (approximately) subdivided into finer and finer hexagonal grids, combining the benefits of a hexagonal grid with [S2](https://code.google.com/archive/p/s2-geometry-library/)'s hierarchical subdivisions. Each hexagonal cell is identified by an H3 index that enables efficient storage, querying, and processing of geospatial data. H3 offers the protocol a flexible and precise geospatial standard with prebuilt bindings for a wide range of programming languages like [Java](https://github.com/uber/h3-java), [JavaScript](https://github.com/uber/h3-js), [Python](https://github.com/uber/h3-py), and [others](https://h3geo.org/docs/community/bindings) are available.

During the discovery phase of a `Buyers` transaction lifecycle, the registry is queried for `PSNs` that can offer products and services that fit the search criteria. The H3 system allows for a `BSN` to query the registry for `PSNs` offering nearby services during the discovery phase of the `Buyers` transaction lifecycle, offering local networks the opportunity to transact when there is a geographic restriction to the nature of the transaction; such as in food delivery or rideshare. 

The H3 standard also allows the protocol to have a holonic structure that naturally scales to the needs of different industries and urban densities, making for a flexible, dynamic, and precise standard for location-specific commercial transactions.

`PSNs` should establish H3 indexes based on the Providers that they represent; translating the self-defined serviceable regions of their Providers to an H3 index that is stored in the registry as an array of strings. Each of these strings represents a hexagonal cell that if queried, should return at lease a single Provider able to commence in a transaction.

For more on generating indexes, see [the h3 GitHub repository](https://github.com/uber/h3?tab=readme-ov-file) 

### Registration

To register a new node, you can use the `registerNode` method provided by the registry SDK. This method takes an object with the following properties:

- `name`: The public name of your node.
- `callbackUrl`: The public endpoint of your deployed server.
- `location`: an array of [h3 strings](https://github.com/uber/h3) that your node supports. The location property is required for PSNs and optional for other node types.
- `industryCode`: a network defined code. Each industry code has a specific protocol that your server must adopt. 
- `nodeType`: a numerical value representing an enum for your node type (PSN = 0, BSN = 1, GP = 2) 

This object is represented by the `RegisterNodeEntryParamsStruct` object from the contract package `@palette-labs/registry-contracts/typechain-types`

```ts 
export type RegisterNodeEntryParamsStruct = {
  name: string;
  callbackUrl: string;
  location: string[];
  industryCode: string;
  nodeType: BigNumberish;
};
```

Here's an example of how to register a node:

```ts
import { NodeRegistry } from "@palette-labs/registry-sdk";
import { ethers, JsonRpcProvider } from 'ethers';

  const nodeRegistryContractAddress = "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb";

  // Setup provider and signer using environment variables
  const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL; 
  const privateKey = process.env.SIGNER!; // your private key.
  const provider = new JsonRpcProvider(providerUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  // Instantiate the NodeRegistry SDK and connect it with the signer
  const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress);
  nodeRegistry.connect(signer);

  // Define a new node to register
  const newNode = {
      name: 'Example Node 2',
      callbackUrl: 'http://example2.com/callback',
      location: ['882681a339fffff'], // Example location
      industryCode: "EX",
      nodeType: 0, // 0 corresponds to PSN
  };

  const transaction = await nodeRegistry.registerNode(newNode);
  await transaction.wait();
  const uid = await transaction.wait()
  console.log(`Node registered with UID: ${uid}`);

  // Example Output
  // Node registered with UID: 0x56e3B524302Ec60Ec7850aF492D079367E03e5fb
```

After registering a node, you can use its UID to retrieve it's information.

### Getting Schema Information
To retrieve the node information for a specific node UID, you can use the `getNode` method provided by the Registry SDK. Here's an example:

```ts
import { NodeRegistry } from "@palette-labs/registry-sdk";

  const nodeRegistryContractAddress = '0x56e3B524302Ec60Ec7850aF492D079367E03e5fb';
  const uid = '0xfd71b914f49331197fd1d14d2f5ab68884dac50d9069b94b927c4d38565df0e3';
  
  // Setup provider and signer using environment variables
  const providerUrl = process.env.ETHEREUM_BASE_SEPOLIA_PROVIDER_URL;
  const privateKey = process.env.SIGNER!; // your private key.
  const provider = new JsonRpcProvider(providerUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  // Instantiate the NodeRegistry SDK and connect it with the signer
  const nodeRegistry = new NodeRegistry(nodeRegistryContractAddress);
  nodeRegistry.connect(signer);

  const nodeEntry = await nodeRegistry.getNode({ uid });
  console.log("Retrieved node:", nodeEntry);

  // Example Output
  Retrieved node: Result(8) [
    '0xfd71b914f49331197fd1d14d2f5ab68884dac50d9069b94b927c4d38565df0e3',
    'Example Node 2',
    'http://example2.com/callback',
    Result(1) [ '882681a339fffff' ],
    'EX',
    '0xd443dDeeC8cD386B6d592b82853738490798922a',
    0n,
    0n
  ]
```

In the output, you will receive an object containing the node UID and it's contents.
