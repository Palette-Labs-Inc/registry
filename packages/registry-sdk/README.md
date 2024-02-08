# Ethereum Attestation Service - TypeScript/JavaScript SDK

[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-blue)](https://eas.eth.link)
[![NPM Package](https://img.shields.io/npm/v/@ethereum-attestation-service/eas-sdk.svg)](https://www.npmjs.org/package/@ethereum-attestation-service/eas-sdk)
[![Test](https://github.com/ethereum-attestation-service/eas-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/ethereum-attestation-service/eas-sdk/actions/workflows/ci.yml)

This repository contains the Ethereum Attestation Service SDK, used to interact with the Ethereum Attestation Service Protocol.

## Installing the Registry SDK.

To install the EAS SDK, run the following command within your project directory:

```sh
yarn add @palette-labs/registry-sdk
```

OR

```sh
npm install @palette-labs/registry-sdk
```

OR

```sh
pnpm add @palette-labs/registry-sdk
```


### Using the SDK

To register a new node, you can use the `registerNode` function provided by the registry SDK. This function takes an object with the following properties:

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

To retrieve the schema information for a specific schema UID, you can use the `getNode` function provided by the EAS SDK. Here's an example:

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

In the output, you will receive an object containing the schema UID, the schema string, the resolver address, and a boolean indicating whether the schema is revocable or not.
