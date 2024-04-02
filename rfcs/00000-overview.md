# Nosh: A Decentralized Network for Open Commerce

## Abstract
Web2 marketplaces tend to be [rent-seeking](https://en.wikipedia.org/wiki/Rent-seeking), charging asymmetric fees relative to the value of the services they provide. These networks create negative externalities on society, reduce economic efficiency, prevent emerging markets, and fail to adequately fill incentive gaps in networks. 

We develop structures for a [self-authenticating](https://en.wiktionary.org/wiki/self-authenticating) protocol specification; a new communication standard, set of rules, and technical specifications for building open e-commerce networks across which providers and their services are universally discoverable from any protocol-enabled application.

Our design grants users the ability to "switch" between managed-hosts `Personal Data Stores`, grant permissions to `Personal Data Stores`, and revoke authorizations from `Personal Data Stores`, shifting control to individuals within the network. This simple design modification ensures that the rent that any infrastructure provider might charge to an account in the network will fall to it's market clearing price. As such, most of the value created by the network will accrue to the edges, maximally benefiting the networks participants as the network matures.

The initial design optimizes for: 
- user choice
- trust
- scale

## Identity
In centralized networks, central servers own a users identity and, as such, their relationship to the network. As the network grows, and power accumulates to central authorities, platforms begin to extract from stakeholders - usually through increasingly high take rates in commercial settings.

We introduce a [self-sovereign identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) framework that shifts control back to the users within the network. Our identity solution aims to achieve the following design considerations:

- **ID provisioning** Users should be able to create global IDs which are stable across services. These IDs should rarely change to ensure that links to their data are stable.
- **Public key distribution** Distributed systems rely on cryptography to prove the authenticity of data and provide end-to-end privacy. The identity system must publish their public keys with strong security.
- **Key rotation** Users must be able to rotate their key material without disrupting their identity.
- **Service discovery** To interact with other users, applications must be able to discover the services in use by a given user.
- **Usability** Users should not have to remember a seed phrase or perform other cognitively demanding tasks to receive the benefits of their decentralized identity.  
- **Portability** Identities should be portable across services. Changing a provider should not cause a user to lose their identity, relationship to the network, or content.
- **Self-Custody**: Users should have full digital control of their identity and their relationship to infrastructure and services within the network.
- **EVM Compatible**: Identity primitives should be compatible with EVM compatible blockchains and serve as a users wallet. Users must be able to earn tokens.
- **Privacy-Preserving Interactions**: Ensure that users can selectively disclose relevant information while protecting sensitive data, such as address information or other personal identifiers.

