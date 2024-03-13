# RFC: Decentralized Registry Infrastructure

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 02-24-2024
- **Last supportd:** 02-24-2024


## Abstract

This document outlines a proposal for a decentralized registry infrastructure. This proposal advocates for permissionless registration onto an EVM compatible blockchain, leveraging existing cryptographic standards (`secp256k1` for signing and `keccak256` for hashing) to simplify Authorization signatures between [Node Operators](./lifecycle-apis.md#node-operator) during server-to-server requests.

For technical details on the registration process, please see the [@palette-labs/registry repository](https://github.com/Palette-Labs-Inc/registry/)

### Motivation
The motivation behind this proposal is to overcome the limitations of centralized registries and improve the security and efficiency of server-to-server communication in a distributed network. 

## Introduction

### About the Network Registry Infrastructure
We are designing a server-to-server architecture for commercial markets. The design supports an interoperable network of independently hosted `Provider Supporting Nodes` and `Buyer Supporting Nodes` that are responsible for onboarding participants on either side of the network.

The network registry is a decentralized public ledger that maintains the records of Node Operators (network servers), agents, their supported Industry Codes, and the geographical regions that they represent. The registry is queried for a Producers products or services during the search phase of a Buyers transaction lifecycle. 

During registration into the network, a Node Operator creates an ethereum key pair. The public key is stored on the blockchain in the network registry along with a unique identifier. When communicating with other Node's in the network, a *sending* Node Operator signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, they should query the registry for the *sending* Node's public key and use the signature in the request header to decrypt the message. If the message is successfully decrypted, the *receiving* Node Operator can know that the *sending* Node Operator is VERIFIED and properly registered. If the *sending* Node Operator's message is unable to be decrypted, the *receiving* Node Operator should respond to the *sending* Node Operators request with an error code. 

All registered Node Operators self-maintain a `location` field in the registry table. The location field supports an array of strings that represent a [`Hexagonal Hierarchical Spatial Index`](https://github.com/uber/h3). 

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


--- 
## Signing headers  

An HTTP Message Signature is a signature over a string generated from a subset of the components of an HTTP message in addition to metadata about the signature itself. When successfully verified against an HTTP message, an HTTP Message Signature provides cryptographic proof that the message is semantically equivalent to the message for which the signature was generated, with respect to the subset of message components that was signed.[1](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures#section-3-1) 

Because all server-to-server communications in the network are async POST requests, we can simplify what gets signed during server-to-server communications by simply signing a base64URL encoded JSON string of the request body. 

During registration, a Node Operator creates a public private key pair. The public key is stored on the blockchain in the network registry along with a unique identifier. When communicating with other Node's in the network, a *sending* Node Operator signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, they should query the registry for the *sending* Node's public key and use the signature in the request header to decrypt the message. If the message is successfully decrypted and the status of the *sending* Node is `VERIFIED`, the *receiving* Node Operator can know that the *sending* Node Operator is properly registered and their message has not been tampered. If the *sending* Node Operator's message is unable to be decrypted, the *receiving* Node Operator should respond to the *sending* Node Operators request with an error code. 

The BSN and PSN is expected to send an Authorization header (as defined in the latest [RFC](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures#name-scheme)  where the “auth-scheme” is “Signature” and the “auth-param” parameters meet the requirements listed in Section 2.3 of [this](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures#section-2.3) document.

Below is the format of a BSN/PSN Authorization header using a typical HTTP Signature format:
`Authorization: Signature keyId="{registry_public_key_identifier}",algorithm="ES256K",created="1606970629",expires="1607030629",headers="(created) (expires) digest",signature="Base64url(secp256k1(signing string))"`

The signature parameters component value is the serialization of the signature parameters for this signature, including the covered components ordered set with all associated parameters. These parameters include any of the following[¶](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures#section-2.): 
- `created`: Creation time as an Integer UNIX timestamp value. Sub-second precision is not supported. Inclusion of this parameter is RECOMMENDED
- `expires`: Expiration time as an Integer UNIX timestamp value. Sub-second precision is not supported
- `algorithm`: The HTTP message signature algorithm from the HTTP Signature Algorithms registry, as a String value. In this case secp256k1.
- `keyid`: The public key identifier for the key material as a String value. This is the public key identifier on the registry for the sending node. The public key can be found by querying the registry based on the public key identifier. 

### Purpose of `headers` in `authorizationHeader`:

1. **Defines Signed Headers**: The `headers` attribute in the `authorizationHeader` specifies which parts of the HTTP request were included when generating the signature. It's a list of HTTP header fields (and potentially pseudo-headers like `(created)` and `(expires)`) that were used to construct the signing string.
    
2. **Guides Signature Verification**: On the *receiving* node, this list tells the server which headers (and their values) need to be collected and used to reconstruct the signing string for signature verification. The server will follow the same order and include the same headers as specified in this list to ensure that the reconstructed signing string matches what was originally signed by the *sending* node.
    
3. **Ensures Integrity of Specific Headers**: By listing specific headers, you're asserting that these headers were part of the signature generation process, and any alteration in these headers would invalidate the signature. 

## Hashing Algorithm
For computing the digest of the request body, the hashing function will use the Keccak256 hashing algorithm. Keccak256 is a member of the Keccak family of cryptographic hash functions and is most notably known for its use in Ethereum. Keccak256 is designed to be secure against a wide range of attacks, including preimage attacks, collision attacks, and length extension attacks. It is also efficient, with a relatively low computational cost and a simple implementation.

## Signing Algorithm
To digitally sign the singing string, the subscribers should use the “secp256k1” signature scheme. The ECDSA algorithm with the secp256k1 elliptical curve is commonly used for signing and verifying messages in the context of Ethereum key-pairs and is also suitable for creating and verifying digital signatures over components of an HTTP message as per the latest RFC standard. Adopting the “secp256k1” signature scheme provides nice interoperability with the protocol networks ethereum registry infrastructure.

## Unique Aspects of ECDSA Ethereum Signing
Ethereum uses the Elliptic Curve Digital Signature Algorithm (ECDSA) over the secp256k1 curve for signing transactions. This involves generating a signature from the Keccak256 hash of the transaction data using a private key. The signature can then be verified with the corresponding public key, proving the transaction was signed by the owner of the private key without revealing the private key itself.
EIP-155 Replay Protection: Ethereum transactions include a chain ID as part of the signing process (specified in EIP-155) to prevent replay attacks across different Ethereum chains. This modification to the standard ECDSA signing process integrates the chain ID into the hash signed by the transaction creator, making the signature chain-specific.
Signature Components: Ethereum signatures consist of three components: r, s, and v. The v component, in particular, helps indicate the recovery ID, which can be used to recover the signer's public key (and thus the address) from the signature itself, a feature not commonly found in standard ECDSA implementations.
Message Signing: Ethereum also allows for signing arbitrary messages (not just transactions) using the eth_sign RPC call or equivalent methods in Ethereum libraries. Messages are prefixed with a specific header before hashing to prevent signed messages from being maliciously used as transaction signatures.


#### Signature Construction 
To construct the signing header when making a network request, you can use the `constructSignatureHeader` method provided by the registry SDK. This method takes the following arguments:

- `body`: the POST request body of the network request.
- `signer`: an eth signer. This signer must be the same signer that registered the node that is making the API request.
- `keyId`: the unique identifier of your node in the regsitry.

 which should be initialized with the same signer that registered the node that is making the API request.

```ts 
    const postBody = { data: 'Example data' };
    const keyId = requestingNodeRegistryId; // the id of the requeting 
    const signature = await nodeRegistry.constructSignatureHeader(body, signer, keyId);
    // Example output 
    // Signature keyId="0x51b9c9ba8f587224ad89a05aed82d6a4bc21cd306043bd0a5338f2c35891d8b9",algorithm="ecdsa-p256-keccak256",created="1707422045",expires="1707422645",headers="(created) (expires) digest",signature="MHhmZDU2OWViZDMzMGQyMDhkNmQxMmFhZTYzY2U2YjBmYzdiZjgyNWVkYjdlZTk3ZDQwOTBlMDU4MDgzZjBmYWQxMDY3Yzg0Yzg1ODcxNmM5NjVkZGMwOTAyNmVkMTIyYmY3YmFmYTM2MjRmNjI0MWU3MjAzZTc2NzYxM2I4ODQ1MjFi"
```

#### Signature Verification
To verify a signing header when receiving a network request, you can use the `verifySignatureHeader` method provided by the registry SDK. This method takes the following arguments:

- `body`: the request body of the HTTP request
- `keyId`: the unique identifier of the requesting node in the regsitry.

```ts 
    const requestBody = { data: 'Example data' };
    const isValid = await nodeRegistry.verifySignatureHeader(body, requestingNodeRegistryId);
    // Example output
    // true

    const body = { data: 'Tampered / Modified request' };
    const isValid = await nodeRegistry.verifySignatureHeader(body, requestingNodeRegistryId);
    // Example output
    // false
```