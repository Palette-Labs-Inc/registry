# Nosh: A Decentralized Network for Open Commerce

## Abstract
Web2 marketplaces tend to be [rent-seeking](https://en.wikipedia.org/wiki/Rent-seeking), charging asymmetric fees relative to the value of the services they provide. These networks create negative externalities on society, reduce economic efficiency, prevent emerging markets, and fail to adequately fill incentive gaps in markets. 

We develop structures for a [self-authenticating](https://en.wiktionary.org/wiki/self-authenticating) protocol specification; a new communication standard, set of rules, and technical specifications for building open e-commerce networks across which providers and their services are universally discoverable from any protocol-enabled application.

Our design grants users the ability to "switch" between managed-hosts `Personal Data Stores`, grant permissions to `Personal Data Stores`, and revoke authorizations from `Personal Data Stores`, shifting control to individuals within the network. This simple design modification ensures that the rent that any infrastructure provider might charge to an account in the network will fall to it's market clearing price. As such, most of the value created by the network will accrue to the edges, maximally benefiting the networks participants as the network matures.

*Our design optimizes for: *
- **User Choice**: if any Personal Data Store fails to maintain it's service, begins charging high fees, or has performance failures, users are free to switch to a new managed host (Personal Data Store)
- **Scale**: Self-authenticating data provides a scalability advantage by enabling [store and forward caching](https://en.wikipedia.org/wiki/Store_and_forward) from one intermediate point to another within a network without sacrificing trust
- **Trust**: Self-authenticating data allows trust to reside in the data itself, widening the set of storage and computational possibilities to a much broader set of possible providers

## Identity
In centralized networks, central servers own a users identity and, as such, their relationship to the network. As the network grows, and power accumulates to central authorities, platforms begin to extract from stakeholders - usually through increasingly high take rates in commercial settings. 

We introduce a [self-sovereign identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) framework that shifts control back to the users within the network. Our identity solution aims to achieve the following:

- **ID provisioning** Users should be able to create global IDs which are stable across services. These IDs should rarely change to ensure that links to their data are stable.
- **Public key distribution** Distributed systems rely on cryptography to prove the authenticity of data and provide end-to-end privacy. The identity system must publish their public keys with strong security.
- **Key rotation** Users must be able to rotate their key material without disrupting their identity.
- **Service discovery** To interact with other users, applications must be able to discover the services in use by a given user.
- **Usability** Users should not have to remember a seed phrase or perform other cognitively demanding tasks to receive the benefits of their decentralized identity.  
- **Portability** Identities should be portable across services. Changing a provider should not cause a user to lose their identity, relationship to the network, or content.
- **Self-Custody**: Users should have full digital control of their identity and their relationship to infrastructure and services within the network.
- **EVM Compatible**: Identity primitives should be compatible with blockchains and serve as a users wallet. Users must be able to earn tokens.
- **Privacy-Preserving Interactions**: Ensure that users can selectively disclose relevant information while protecting sensitive data, such as address information or other personal identifiers.

Users create a global identity within the network by going through a registration procedure and interfacing with on-chain smart contracts. A users identity is a numeric identifier like `423987` controlled by a key pair, and is called the `account identifier`. We also introduce the concept of a `delegated signer`. Delegated signing allows a user to easily interact with the network and it's avilable services while delegating the signing process to a client that represents their interests. Delegated signatures allow clients to automate the signature process so the user does not have to present their private key during every stage in their transaction lifecycle. Users can unilaterally revoks signature delegation at any time.

## Personal Data Stores
The PDS is a webserver containing a content-addressed personal data repository for a user's account. This repository represents a collection of records stored by a user and signed by the users delegated signature authority (delegated signer). Repositories contain self-authenticating data structures, meaning each creation or update of a piece of content is signed, canonical, live, transactable, and can be independently verified by any third party regardless of the storage location of the data.

If any `Personal Data Store` fails to maintain it's service, begins charging high fees, or has performance failures, users are free to switch to a new managed host provider (`Personal Data Store`), including to their own infrastructure. Because, 1. it is easy to switch hosts, 2. it is easy for anyone to operate a `Personal Data Stores`, `Personal Data Stores` will be able to charge *the exact rent* that their service can justify in an open market. 

A user's PDS also serves as a generic HTTP proxy between the user and other services within the network. We assume that 

## Intent Casting and Federation
Users are categorized as either a `Buyer` or `Provider`. Each represents a specific *type* of user on either side of a two-sided market. User's can discover one another and engage in purchasing behavior through a basic server-to-server communication standard in a peer-to-peer network. All peers, in this context, are PDS servers that are registered and discoverable in a global, public, decentralized [registry](./00002-node-registry.md) infrastructure. 

Peers are represented as either `Buyer Supporting Nodes (BSN)` or `Provider Supporting Nodes (PSN)`, depending on whether they support the `Buyer` or `Provider` side of the market.

`Buyers` form purchase intents as signed data request's on any protocol-enabled client. The user's PDS receive requests on behalf of a user and proxies these search requests to the network. Purchase intents discover PDS servers that support `Providers` who have the capacity to fulfill the purchase intent by indexing a list of available services in the netowrk's registry infrastructure. This process of discovery is called intent-casting. After discovery, a `Buyer` and `Provider` peer can directly engage and commence in their transaction without the need for an intermediary. 

## Interoperability Guarantee
An open network like nosh needs a way to agree on data structures, transport, and semantics. During inter-service network communications (like intent-casting), PDS nodes receive strong typechecks and runtime correctness guarantees by implementing the "Nosh Schema Defintion Language (NSDL)". The NSDL NSDL is similar to an [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) specification with added semantic nice-to-haves and opinions for ensuring interoparability among services.

The NSDL is used to define RPC methods and record types, providing developers with a standardized approach and workflow for crafting and specifying new data structures within the network. Such a standard allows protocol implementations to have strong guarantee as the network matures into new categories. 

## Future Work
- Insurance, Arbitration, and Disputes
- Indexers, Gateways
- Payments