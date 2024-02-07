# Ethereum Attestation Service - TypeScript/JavaScript SDK

[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-blue)](https://eas.eth.link)
[![NPM Package](https://img.shields.io/npm/v/@ethereum-attestation-service/eas-sdk.svg)](https://www.npmjs.org/package/@ethereum-attestation-service/eas-sdk)
[![Test](https://github.com/ethereum-attestation-service/eas-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/ethereum-attestation-service/eas-sdk/actions/workflows/ci.yml)

This repository contains the Ethereum Attestation Service SDK, used to interact with the Ethereum Attestation Service Protocol.

## Installing the Registry SDK.

To install the EAS SDK, run the following command within your project directory:

```sh
yarn add @palette-labs/registry-ts-sdk
```

OR

```sh
npm install @palette-labs/registry-ts-sdk
```

OR

```sh
pnpm add @palette-labs/registry-ts-sdk
```


### Using the SDK

To register a new schema, you can use the `registerNode` function provided by the registry SDK. This function takes an object with the following properties:

- `schema`: The schema string that defines the structure of the data to be attested.
- `resolverAddress`: The Ethereum address of the resolver responsible for managing the schema.
- `revocable`: A boolean value indicating whether attestations created with this schema can be revoked.

Here's an example of how to register a new schema:

```ts
import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

const schemaRegistryContractAddress = "0xYourSchemaRegistryContractAddress";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

schemaRegistry.connect(signer);

const schema = "uint256 eventId, uint8 voteIndex";
const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
const revocable = true;

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable,
});

// Optional: Wait for transaction to be validated
await transaction.wait();
```

After registering a schema, you can use its UID to create attestations with the specified structure.

### Getting Schema Information

To retrieve the schema information for a specific schema UID, you can use the `getSchema` function provided by the EAS SDK. Here's an example:

```javascript
import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";

const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
schemaRegistry.connect(provider);

const schemaUID = "0xYourSchemaUID";

const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

console.log(schemaRecord);

// Example Output
{
  uid: '0xYourSchemaUID',
  schema: 'bytes32 proposalId, bool vote',
  resolver: '0xResolverAddress',
  revocable: true
}
```

In the output, you will receive an object containing the schema UID, the schema string, the resolver address, and a boolean indicating whether the schema is revocable or not.
