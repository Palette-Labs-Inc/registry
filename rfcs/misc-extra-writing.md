In computer science, an authenticated data structure is one that can attest to it's own authenticity. Self-authenticated data can have it's operations carried out by an untrusted prover and any independently verifier can verify it's authenticity by generating a compact proof. Such data structures can then support outsourcing data processing and other tasks to untrusted `Node Operators` without an integrity sacrifice. These processes allow trust to be in the hands of the user instead of a host or trusted webserver.  

This is a departure from the pervasive client-to-server architecture models of the modern Web. When information is host-certified it becomes dead when it is no longer hosted. Self-authenticating data structures move authority to the user and therefore preserve the liveness of data independent of the storage location. Such properties are desirable in distributed systems when you want to push power and control to the edges of the network (away from central authorities, and back to the network's agents).

Self-authenticating data structures can be satisfied by two properties:
_[Content-addressed data](https://en.wikipedia.org/wiki/Content-addressable_storage)_ means that all data created in the network are passed through a [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) to generate a unique digital "fingerprint" of a piece of content. Using public keys and content-addresses, we sign all content by the `agent`s signature. For any piece of content, this signing process will always generate the same "fingerprint". All attemps to store this content will always generate the same "fingerprint". Because changing the file will result in a new "fingerprint", we can know that the data was never tampered with during transport. This process allows trust to reside in the data itself, rather than where the content is located. 

_[Digital Signatures](https://en.wikipedia.org/wiki/Digital_signature)_ [Self-sovereign identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) as discussed in the [identity contracts RFC](./00003-identity-contracts.md), associate `agents` with a key pair that give them control over their content without a trust sacrifice. As such, control of an account is proved by a cryptographic signature from the `agent`, rather than an entry in a database.

## Motivation
Web2 marketplaces tend to be [rent-seeking](https://en.wikipedia.org/wiki/Rent-seeking), charging asymmetric fees relative to the value of the services they provide. These networks create negative externalities on society, reduce economic efficiency, prevent emerging markets, and fail to adequately fill incentive gaps in networks. 

## Technical Challenges

1. **Privacy**: Incorporate privacy-preserving techniques, such as selective disclosure and zero-knowledge proofs, to protect sensitive user data (e.g., addresses, payment information) during transactions and interactions within the network. The existing Bsky PDS architectures assumes that data is public and insensitive. In the case of our network, we need to ensure that private data is not shared with untrusted parties without the users consent.

2. **Interoperability with Open Standards**: Ensure compatibility with existing decentralized identity standards, such as Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs), to enable interoperability and leverage existing ecosystems.

3. **Compatibility with Existing Mobile Operating Systems**: iOS and Androing architectures currently require associated domains for authentication flows which are opinionated to client-to-server architectures and may have implications on the data portability requirement.

4. **Multiple Devices**: Current WebAuthN / Passkey implementations are opinionated to client-to-server architectures. In an ideal world, a users data server could be shared across a users local network of devices (mobile phones, laptops, smart watches, etc)

5. **Delegated Signing**: WebAuthN and Passkeys use public-private key cryptography for signing data. They are a significant UX improvement over traditional seed phrase management experiences in other crypto projects. However, we do not want to prompt users for their faceID or pin everytime a message gets signed during their transaction lifecycle. Instead, we could opt to simply register the user with a node using WebAuthN apis and establish a signature delegation pattern that allows for an individual user to grant and revoke signing capabilities for nodes by directly interacting with a smart contract from the client without asking the server for permission. If the server should perform the task of interacting with the smart contract, this should be done within a trusted execution environment ([TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment)) like [intel sgx](https://www.intel.com/content/dam/develop/external/us/en/documents/overview-of-intel-sgx-enclave-637284.pdf). It would be useful to research whether or not a smart contract registry or distributed hash table for signature delegation is necessary or if this pattern could be self-authenticating within a locally stored context blob on a users device that contains the public key of their designated signer(s) / personal data node(s). This second option seems technically simpler and, as such, ideal but we should consider the implications of each design pattern and whether self-authenticating structures are possible. I am not realizing that whatever decision is made for individual users should be uniform across server-to-server communication as well. If we decide on using self-authenticating messages by including the public key address in a context blob in the HTTP Authorization Header  in server-to-server communications, we can modify signature validation methods in the `registry-sdk` accordingly.

In centralized networks, central servers own a users identity and, as such, their relationship to the network. As the network grows, and power accumulates to central authorities, platforms begin to extract from stakeholders - usually through increasingly high take rates in commercial settings.

To prevent such undesirable dynamics, we develop structures for a [self-authenticating](https://en.wiktionary.org/wiki/self-authenticating) protocol. Our design grants users the ability to "switch" between managed-hosts (nodes), grant permissions to nodes, and revoke authorizations from nodes, shifting control to individual agents within the network. Therefore, the rent that any infrastructure provider might charge to an agent in the network will fall to it's market clearing price. As such, most of the value created by the network will accrue to the edges, maximally benefiting the networks participants as the network matures.

[Our design](./00001-lifecycle-apis.md) supports an interoperable network of independently hosted `Provider Supporting Nodes` and `Buyer Supporting Nodes` that are responsible for onboarding participants on either side of the network, storing their data, and relaying transaction `messages` to other nodes in the network. We are not strictly a p2p network; we assume webservers are necessary for performing computational tasks for filtering information and providing app views. We also assume that most users will not want to host their infrastructure, although this is entirely possible within the standard.

By removing entry requirements, the network allows for independent actors to introduce local optimizations, taking advantage of societies collective cognitive surplus to fill economic incentive gaps in markets. Ease of entry into the network will give rise to currently inconceivable consumer experiences.

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