## Getting Started
Set up your wallet [here](https://docs.base.org/guides/deploy-smart-contracts/)

## Deployments

Please note that you can also import and use the addresses directly in your code using the `@palette-labs/registry/deployments` deployment artifacts corresponding to your desired network.

### Mainnets
#### Ethereum

coming soon.

### Testnets

#### Base Sepolia

Version 0.0.1:
* **NodeRegistry**:
  * Contract: [0x90c35b5CC8785C8C963fEDF2Fd15A4286058021f](https://sepolia.basescan.org/address/0x4200000000000000000000000000000000000020)
  * Deployment and ABI: [NodeRegistry.json](./deployments/base-goerli/NodeRegistry.json)

* deployment logs
```sh
deploying "NodeRegistry" (tx: 0x835613322d4f33e3dc5ace957c283d8f1e105ef5fecfacdb9d9743eaa7db4e87)...: deployed at 0x56e3B524302Ec60Ec7850aF492D079367E03e5fb with 1105818 gas
  executing NodeRegistry.registerNode : (0x56e3B524302Ec60Ec7850aF492D079367E03e5fb)
  registerNode params: 
    entry (tuple): [object Object]
executing NodeRegistry.registerNode (tx: 0x315f6f500cd523eb44f8c6a5edfcb2ba019b0c22799cb657b373ca62ec5db012) ...: performed with 193055 gas
  executing NodeRegistry.registerNode : (0x56e3B524302Ec60Ec7850aF492D079367E03e5fb)
  registerNode params: 
    entry (tuple): [object Object]
executing NodeRegistry.registerNode (tx: 0x7920ed29a8955ac318defa95eff7c04c7ae6f2f4a1e6abc8e4834c9a2acf8dc9) ...: performed with 192868 gas
✨  Done in 22.28s.
```

## Installation
```sh
yarn add @palette-labs/registry
```

## Testing

Testing the protocol is possible via multiple approaches:

### Unit Tests

You can run the full test suite via:

```sh
yarn test
```

### Test Coverage

#### Latest Test Coverage Report (2024-02-04)
```sh
--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |      100 |      100 |    85.71 |     87.5 |                |
  Common.sol        |      100 |      100 |        0 |        0 |          27,28 |
  INodeRegistry.sol |      100 |      100 |      100 |      100 |                |
  ISemver.sol       |      100 |      100 |      100 |      100 |                |
  NodeRegistry.sol  |      100 |      100 |      100 |      100 |                |
  Semver.sol        |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |      100 |    85.71 |     87.5 |                |
--------------------|----------|----------|----------|----------|----------------|

```
#### Instructions

In order to audit the test coverage of the full test suite, run:

```sh
yarn test:coverage
```

## Profiling

You can profile the gas costs of all of the user-focused flows via:

```sh
yarn test:profile
```

## Deploying

The contracts have built-in support for deployments on different chains and mainnet forks. You can deploy the project by:

```sh
yarn deploy
```

The framework was inspired and adopted from [EAS](https://github.com/ethereum-attestation-service/eas-contracts/).

## License

@palette-labs/registry is open source and distributed under the MIT License (see [`LICENSE`](./LICENSE)).