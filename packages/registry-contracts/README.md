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
deploying "NodeRegistry" (tx: 0x51fe522e1003ce51c3df39b560231297992ddea0246aa70f3f3de717a511ce0c)...: deployed at 0x1AB85870ae7732418ba084C1862704BD523d0505 with 1081514 gas
  executing NodeRegistry.registerNode : (0x1AB85870ae7732418ba084C1862704BD523d0505)
  registerNode params: 
    entry (tuple): [object Object]
executing NodeRegistry.registerNode (tx: 0x0b22813b8219065cf0b910a7a5dd137c83b87da0abab1c50ef4cd4c9fde97f9d) ...: performed with 192672 gas
  executing NodeRegistry.registerNode : (0x1AB85870ae7732418ba084C1862704BD523d0505)
  registerNode params: 
    entry (tuple): [object Object]
executing NodeRegistry.registerNode (tx: 0xf37cc3cf50d28efedc54d6527259ab306a296c5c30122e9e7f2450b5e98bd237) ...: performed with 192684 gas
✨  Done in 22.62s.
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