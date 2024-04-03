
## Technical Challenges

1. **Privacy**: Incorporate privacy-preserving techniques, such as selective disclosure and zero-knowledge proofs, to protect sensitive user data (e.g., addresses, payment information) during transactions and interactions within the network. The existing PDS architectures assumes that data is public and insensitive. In the case of our network, we need to ensure that private data is not shared with untrusted parties without the users consent.

3. **Compatibility with Existing Mobile Operating Systems**: iOS and Androing architectures currently require associated domains for authentication flows which are opinionated to client-to-server architectures and may have implications on the data portability requirement.

4. **Multiple Devices**: Current WebAuthN / Passkey implementations are opinionated to client-to-server architectures. In an ideal world, a users data server could be shared across a users local network of devices (mobile phones, laptops, smart watches, etc)

5. **Delegated Signing**: WebAuthN and Passkeys use public-private key cryptography for signing data. They are a significant UX improvement over traditional seed phrase management experiences in other crypto projects. However, we do not want to prompt users for their faceID or pin everytime a message gets signed during their transaction lifecycle. Instead, we could opt to simply register the user with a node using WebAuthN apis and establish a signature delegation pattern that allows for an individual user to grant and revoke signing capabilities for nodes by directly interacting with a smart contract from the client without asking the server for permission. If the server should perform the task of interacting with the smart contract, this should be done within a trusted execution environment ([TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment)) like [intel sgx](https://www.intel.com/content/dam/develop/external/us/en/documents/overview-of-intel-sgx-enclave-637284.pdf). It would be useful to research whether or not a smart contract registry or distributed hash table for signature delegation is necessary or if this pattern could be self-authenticating within a locally stored context blob on a users device that contains the public key of their designated signer(s) / personal data node(s). This second option seems technically simpler and, as such, ideal but we should consider the implications of each design pattern and whether self-authenticating structures are possible. I am not realizing that whatever decision is made for individual users should be uniform across server-to-server communication as well. If we decide on using self-authenticating messages by including the public key address in a context blob in the HTTP Authorization Header  in server-to-server communications, we can modify signature validation methods in the `registry-sdk` accordingly.


## References
1. [W3C Web Authentication (WebAuthn) Specification](https://www.w3.org/TR/webauthn/)
2. [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/)
3. [Verifiable Credentials Data Model 1.0](https://www.w3.org/TR/vc-data-model/)
5. [Content-Addressable Storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
7. [Solid MIT Project](https://solidproject.org/)
8. [Zero-Knowledge Proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof)
9. [User-Controlled Capabilities (UCAN)](https://ucan.xyz/)
11. [Coinbase Smart Wallet](https://github.com/coinbase/smart-wallet?tab=readme-ov-file)
12. [Farcaster Protocol Specification](https://github.com/farcasterxyz/protocol)
13. [Intentcasting](https://customercommons.org/category/intentcasting/)