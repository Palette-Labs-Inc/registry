# RFC: Self-Sovereign Identity and Data Portability for Federated Commercial Networks with WebAuthn and Personal Data Nodes

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-13-2024
- **Last supportd:** 03-13-2024

## Abstract

This RFC proposes a self-sovereign identity and data portability framework for decentralized commercial networks, using WebAuthn, personal data stores, and decentralized identifiers (DIDs).

## Introduction

[Our design](./00001-lifecycle-apis.md) supports an interoperable network of independently hosted Provider Supporting Nodes and Buyer Supporting Nodes that are responsible for onboarding participants on either side of the network, storing their data, and communicating with other nodes in the network. We are not strictly a p2p network in that we assume nodes are necessary for performing computationally heavy tasks. We also assume that most users will not want to host their infrastructure. 

In centralized networks, central servers own a users identity and, as such, their relationship to the network. As the network grows, and power accumulates to central authorities, platforms begin to extract from stakeholders - usually through increasingly high take rates in commercial settings.

To prevent such undesirable dynamics, we develop structures for a [self-authenticating](https://en.wiktionary.org/wiki/self-authenticating) protocol. Our design grants users the ability to "switch" between managed-hosts (nodes), grant permissions to nodes, and revoke authorizations from nodes, shifting control to individual agents within the network.

## Motivation

The proposed solution aims to achieve the following goals:

1. **User Control of Identity and Data**: Enable users to maintain control over their identities and personal data. Users who want to switch providers can transfer their data at their convenience, including to their own infrastructure
2. **Privacy-Preserving Interactions**: Ensure that users can selectively disclose relevant information while protecting sensitive data, such as addresses or personal identifiers
3. **Seamless Migration between Hosts**: Allow users to switch between managed hosts (nodes) seamlessly, without losing their identity or data, and without requiring permission from their existing host
4. **Content-Addressed Data Structures**: Enabling users to carry their data between different nodes and platforms
6. **Decentralized Identity Management**: Compatibble with existing decentralized identifiers (DIDs) and Verifiable Credentials (VCs)
7. **Self-Custody**: Genuine digital ownership where users have exclusive control over their assets
8. **EVM Compatible**: Identity primitives should be compatible with EVM's and server as a users wallet. Users must be able to earn blockchain tokens

## Proposal

The task for this effort is to create a fork of the [bsky personal data server (PDS)](https://github.com/bluesky-social/atproto) from the bsky monorepo and make it compatible with existing [WebAuthN](https://www.w3.org/TR/webauthn-3/) standards.

The following design considerations are inherited by the [bsky PDS](https://github.com/bluesky-social/pds):
- Data portability: Users who want to switch hosting providers can transfer their data at their convenience, including to their own infrastructure. 
- [Self Sovereign Identity](https://github.com/WebOfTrustInfo/self-sovereign-identity/blob/master/ThePathToSelf-SovereignIdentity.md). Control of an account is proved by a cryptographic signature from a user.

The following design considerations are inherited by [WebAuthN](https://www.w3.org/TR/webauthn-3/):
- Usability: apple and android ecosystems have WebAuthN apis that allow for simple auth flows with FaceID.
- Interoperability: [Passkeys](https://www.passkeys.io/) make WebAuthn usable in consumer settings with unsophisticated users by building on existing standards within popular mobile frameworks and browsers

### Key Components:

1. **Personal Data Server (PDS)**: A user-controlled data store (inspired by the Bluesky AT Protocol's PDS and Solid MIT's Pods) where individuals can manage their identities, personal data, and credentials. The PDS serves as a "data backpack" for users, enabling them to carry their data across the network. This design is a significant departure from existing client-to-server architectures.

2. **WebAuthn Integration**: WebAuthn should be integrated into the PDS, allowing users to control their data using their existing devices.

3. **Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs)**: The solution will support DIDs and VCs, enabling interoperability with existing decentralized identity standards and ecosystems. DIDs can serve as unique, global, and memorable identifiers for users, while VCs can represent various attributes or claims about their identity and credentials.

4. **Privacy-Preserving Mechanisms**: The solution will incorporate mechanisms for privacy-preserving interactions, such as selective disclosure of information, zero-knowledge proofs, and secure communication channels, to protect sensitive user data.


## Technical Challenges

1. **Privacy**: Incorporate privacy-preserving techniques, such as selective disclosure and zero-knowledge proofs, to protect sensitive user data (e.g., addresses, payment information) during transactions and interactions within the network. The existing Bsky PDS architectures assumes that data is public and insensitive. In the case of our network, we need to ensure that private data is not shared with untrusted parties without the users consent.

2. **Interoperability with Open Standards**: Ensure compatibility with existing decentralized identity standards, such as Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs), to enable interoperability and leverage existing ecosystems.

3. **Compatibility with Existing Mobile Operating Systems**: iOS and Androing architectures currently require associated domains for authentication flows which are opinionated to client-to-server architectures and may have implications on the data portability requirement.

4. **Multiple Devices**: Current WebAuthN / Passkey implementations are opinionated to client-to-server architectures. In an ideal world, a users data server could be shared across a users local network of devices (mobile phones, laptops, smart watches, etc)

5. **Delegated Signing**: WebAuthN and Passkeys use public-private key cryptography for signing data. They are a significant UX improvement over traditional seed phrase management experiences in other crypto projects. However, we do not want to prompt users for their faceID or pin everytime a message gets signed during their transaction lifecycle. Instead, we could opt to simply register the user with a node using WebAuthN apis and establish a signature delegation pattern that allows for an individual user to grant and revoke signing capabilities for nodes by directly interacting with a smart contract from the client without asking the server for permission. If the server should perform the task of interacting with the smart contract, this should be done within a trusted execution environment ([TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment)) like [intel sgx](https://www.intel.com/content/dam/develop/external/us/en/documents/overview-of-intel-sgx-enclave-637284.pdf). It would be useful to research whether or not a smart contract registry or distributed hash table for signature delegation is necessary or if this pattern could be self-authenticating within a locally stored context blob on a users device that contains the public key of their designated signer(s) / personal data node(s). This second option seems technically simpler and, as such, ideal but we should consider the implications of each design pattern and whether self-authenticating structures are possible. I am not realizing that whatever decision is made for individual users should be uniform across server-to-server communication as well. If we decide on using self-authenticating messages by including the public key address in a context blob in the HTTP Authorization Header  in server-to-server communications, we can modify signature validation methods in the `registry-sdk` accordingly.

6. **Identity Registries**: We may need to add a decentralized identity registry to store the public keys of registrants to enable verification of individually signed messages within the network. We may also need a relational registry that defines the relationship between an individual in the network and their personal data store for signature delegation (defined above). The decentralized identity registry is used to verify signed messages in the distributed system. You can see how this works in this repository for server-to-server communications by viewing the `registry-sdk` [methods](../packages/registry-sdk/src/node-registry.ts) for signature construction and verification.

## Acceptance Criteria
- Add a package called `personal-data-node` to the /packages subdirectory in [this repository](https://github.com/Palette-Labs-Inc/registry)

## References
1. [W3C Web Authentication (WebAuthn) Specification](https://www.w3.org/TR/webauthn/)
2. [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/)
3. [Verifiable Credentials Data Model 1.0](https://www.w3.org/TR/vc-data-model/)
5. [Content-Addressable Storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
6. [Bluesky AT Protocol Documentation](https://blueskyweb.xyz/docs/overview)
7. [Solid MIT Project](https://solidproject.org/)
8. [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)
9. [User-Controlled Capabilities (UCAN)](https://ucan.xyz/)
10. [Data repositories](https://atproto.com/guides/data-repos)
11. [Coinbase Smart Wallet](https://github.com/coinbase/smart-wallet?tab=readme-ov-file)
12. [Farcaster Protocol Specification](https://github.com/farcasterxyz/protocol)
13. [Intentcasting](https://customercommons.org/category/intentcasting/)