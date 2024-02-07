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
deploying "NodeRegistry" (tx: 0x843876e098172ef143fcae1589578f135e92e131e6bc70a7e2d839545930cfb9)...: deployed at 0x90c35b5CC8785C8C963fEDF2Fd15A4286058021f with 1024607 gas
  executing NodeRegistry.registerNode (0x90c35b5CC8785C8C963fEDF2Fd15A4286058021f)
  registerNode params: 
    entry (tuple): [object Object]
executing NodeRegistry.registerNode (tx: 0x2562816876520a369fd15ab5f72297de6e283426271aae2e858477008ba23d0c) ...: performed with 173019 gas
  executing NodeRegistry.registerNode (0x90c35b5CC8785C8C963fEDF2Fd15A4286058021f)
  registerNode params: 
    entry (tuple): [object Object]
executing NodeRegistry.registerNode (tx: 0xe24dd012297a701669e940772ffe50fc5b5754d4f712c2297de8ba3027e170a0) ...: performed with 192943 gas
✨  Done in 18.21s.
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