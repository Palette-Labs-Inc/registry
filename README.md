# registry

## Repository structure



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