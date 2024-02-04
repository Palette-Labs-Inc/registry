## TODOs
- [ ] Get etherscan api key
- [ ] run verify command for deployed contract on base-sepolia

- [ ] Build a simple interface to call the `registerNode` method in the registry contract
- [ ] Build a simple interface to call the `getNode` method in the registry contract
- [ ] Figure out how to subscribe to the emission event in the smart contract so that any indexer has the latest state, (search EAS dev chat in tg for **Yeah, you can either subscribe to the Attested event that the EAS contract emits or using GraphQL**)
- [ ] Build the GraphQL Indexer for the registry


## Known Issues
- The `/test/NodeRegistry.ts` test does not cover the emit() event when new nodes are registered. This is because the withArgs method in the testing library does not deep compare arrays within structs. Since the location field in the registry conrtract is an array of strings, the assertion will fail. 

```ts
    // known issue - withArgs doesn't deep compare arrays within structs, so the location assertion will fail the emit test
    // issue https://github.com/NomicFoundation/hardhat/issues/4207
    // issue https://github.com/NomicFoundation/hardhat/issues/3833 
    // await expect(res).to.emit(registry, 'Registered').withArgs(uid, await sender.getAddress(), nodeEntry);  
```

