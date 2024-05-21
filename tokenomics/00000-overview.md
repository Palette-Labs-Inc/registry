# Nosh, a Protocol for Decentralized Commerce

## Abstract
This paper establishes the technical and economic foundations for a trustless peer-to-peer services marketplace. A dynamic transaction graph, token incentives, arbitration system, and service-proof provide service guarantees between producers and consumers in a commerfial transaction.

Traditional marketplaces perform the following critical functions that we decentralize with a crypto-economic protocol and shared networking infrastructure:
- A network of sellers
- A network of buyers
- A process to resolve disputes (trust)
- A discovery and communication mechanism

A programmable open and extensible architecture allows for the creation of a wide range of specialized marketplaces that cater to specific markets and use cases. The protocol enables the emergence of novel services and composable markets that were previously infeasible due to trust limitations and coordination costs.

## Definitions

**Block Reward**: a token that is created when a buyer and a producer transact
**Buyer**: a user with an intent to purchase a service
**Producer**: a user with the ability to fulfill a buyer's purchase intent
**Arbiter**: an entity that resolves disputes between a buyer and a producer

## Motivation
Traditional marketplaces tend to be [rent-seeking](https://en.wikipedia.org/wiki/Rent-seeking), charging asymmetric fees relative to the value of the services they provide. These networks create negative externalities on society, reduce economic efficiency, prevent emerging markets, and fail to adequately fill incentive gaps in markets. Over time, marketplaces accumulate power and trend towards rents that are equal to the margins of their suppliers. As the platform grows, fees to buyers increase and earnings for sellers decrease. Traditional centralized marketplace platforms are therefore economically sub-optimal and fail to meet the demands of modern markets.

In contrast, a decentralized, permissionless network unlocks local-knowledge from a much broader network of individuals who are better equipped to fill incentive gaps in unique markets and more quickly adapt to the rapid changes in consumer preferences faster than any central planner.

In designined a decentralized protocol for an arbitrary 

The primary constraint in the design of such a protocol is the inability to systematically verify a wide-range of real-world activity. Real-world activity is subject to the Oracle problem, and 



that there is no cryptographic way to prove real-world activities. This could limit the scope of our design to rewarding token distributions from a protocol-fee. Unless we do KYC of all of the participants in the network, users could create identities as both a buyer and a seller in the network, create transactions with themselves and earn a token reward for self-dealing. Such interactions should not be profitable but this limits the scope of our design space.

classical consensus or validity proofs 

honest majority assumption.


Design optimizes for network effects, is immutable

## Introduction
The Nosh protocol is a decentralized marketplace built around a dynamic transaction graph and native token network. Producers (e.g. restaurants, drivers) earn a block reward by providing service-proofs to the network. Buyers earn rewards through an augmentation fee that Producers use as a means to market their services to the Buyer network. The graph allows for dynamic markets to discover optimal token distributions without having to make naive assumptions about the behavior of participants or the properties of the market in advance. Block rewards are paid out at a pre-defined reward epoch relative to the state of the transaction graph. Rewards are redistibuted based on a modified eigenvector centrality ranking which computes the "relative influence" of a producer to the network, granting asymetrically large rewards to high value producers. 

In the case of a dispute, a decentralized network of arbiters provide a resolution service. The losing party in a dispute can have the edge-weights in their transaction graph slashed or burned, harming their future earning potential in the network. This mechanism reduces the frequency of false-claims for economically rational actors. In a dispute, arbiters are eligible to earn the block reward that would have otherwise been earned for creating the transaction, as well as a portion of the tokens slashed from the edge-weights in the transaction graph.  

In future iterations designs, we may make assume more data to be private, but our initial model assumes that data about participants and their history is public and annonymized. Because data is stored in publicly indexed data repositories, there is *no information assymetry*. Because there is no information asymmetry, arbiters are expected to charge fees at their market clearing price or be replaced by more reasonable agents. 

Reputation of participants will be stored in a distributed-hash-table. Malicious Producers who lose disputes frequently or perform lazily, will acquire bad reputations, making them less likely to be discovered or prioritized in search requests. The arbiter network can associate risk scores with each participant, making it more expensive to transact with providers or consumers with bad reputations.

Our design has these properties:
- The protocol is built on a native token, where producers earn tokens for providing services and buyers earn tokens by transacting with producers.
- Transactions are represented in a dynamic transaction graph, with nodes for producers and buyers, and weighted edges capturing their activity.
- The protocol removes centralized middlemen, enabling direct producer-buyer interactions in a decentralized marketplace.
- Adjustable augmentation fees allow the market to self-regulate based on collective participant actions across diverse commercial contexts.
- Immutablility: optimal token distributions are discovered based on the pricing power of producers in different sub-markets.
- Decentralized identity management verifies that the participants are unique to prevent sybil attacks.
- Reputation and rating systems allow participants to rate each other, adjusting edge weights in the transaction graph to incentivize good behavior.
- A multi-signature escrow contract holds funds until both parties attest to service completion. Escrow contracts resolve upon a signed mutual attestation.
- Decentralized dispute resolution mechanisms and community arbitration protocol resolve conflicts.
- A modified eigenvector centrality ranking replaces the need for strict service-proofs and protects the network against collusion and malicious actors.
- A decentralized arbitration service to handle disputes, even when services are performed.

Our economic model optimizes for:
- bootstrap supply
- bootstrap demand
- increase the volume of transactions over time
- mature markets in equilibrium must pay market participant's proportional to their marginal contribution
___

### Dynamic Transaction Graph
The Dynamic Transaction Graph is a bipartite graph that captures the economic relationships between producers and buyers, with weighted edges representing the cumulative fees from their past transactions. This graph-based approach allows the network to dynamically adjust token incentives based on the actual economic activity and pricing power of participants, ensuring a fair and efficient allocation of rewards that adapts to the unique properties of each market, whether location-dependent or location-independent.

**The Graph**: A bipartite graph `G = (U, V, E)` representing producers `U` and buyers `V` as nodes, with weighted edges `E` capturing transactions between them. Edge weights `w(u, v)` track the cumulative fees contributed by producer u from transactions with buyer `v`.

**Token Incentives**: Producers earn tokens through a weighted revenue sharing mechanism that distributes block rewards proportional to their relative edge weights with each buyer. This incentivizes active participation and increased contributions.

**Augmentation Fees**: Buyers can earn augmentation fees `(w)` to participate in transactions, creating a self-regulating market. A dynamic augmentation fee refines the optimal token allocation for each of the two participants based on the pricing power of the producer. In a market where producers have high pricing power, we imagine most of the reward for a given transaction to accrue to the producer, and the opposite to be the case for markets where producers sell goods with many substitutes.

**Implicit Staking**: Tokens are locked within the graph until participants liquidate, disincentivizing harmful liquidations that could destabilize the network economy. Tokens are minted by burning the edges. When a transaction `T = (u, v, p, f, w)` occurs between producer u and buyer `v` with payment `p`, platform fee `f`, and augmentation fee `w`, the edge weight `w(u, v)` is updated to `w(u, v) + f + w.`

**Early Adopter Rewards**: Early adopters are rewarded through a revenue sharing mechanism where fees `f` are distributed among all producers, awarding `f * (w(u', v) / Σ(u'', v) ∈ E w(u'', v))` tokens to each producer `u'` based on their relative edge weight with buyer `v`. As the network matures, rewards become proportional to revenue contributions.

**Balanced Growth**: The dynamic transaction graph and token incentives are designed to encourage balanced growth of supply and demand. As producers earn tokens based on their transaction history and relative contribution to the network, they are incentivized to continuously improve their offerings and attract more buyers. 


#### Action Items: 

**Misc**
- [ ] How to prevent against buyer rewards just being sold for cash? We seem to be missing a mechanism here for how buyer rewards re-inforce loyalty. Can we model the buyer / seller sinks and faucets and describe in detail how they are intending to optimize for transactions? 
- [ ] We care that buyers are loyal to the network, not that buyers are loyal to any particular producer. The network should not be "producer owned" just optimized for transactions, that's what producers would prefer as well.
- [ ] I think we should poke at and explore the nuances of the implicit staking mechanisms. Does it make sense that producers have the unilateral authority to mint tokens from the graph? 

**Measuring the network gravity of participants**
How can we formulate this as a dynamic optimization problem? For example, some Marquee producers have more "gravity" or introduce more "momentum" in a local market than others. In this market, certain "marquee" producers, such as Chipotle, have a significantly higher influence on the network compared to less popular producers, such as Garbage Pasta Store. This influence can be captured by the concept of eigenvector centrality, which measures the importance of a node based on the importance of its neighbors. Because Chipotle brings more value to the graph, we might want to redistribute tokens from the edge-weights of Garbage Pasta to Chipotle's edges. The reward allocation should be robust to changes in the market structure and adapt to the evolving influence of nodes over time, for example if a node goes out of business.  

- [ ] Can we measure influence maximization and borrow from the future to onboard highly influential supply? i.e. the Chipotle's / Starbucks / McDonalds of the restaurant world? How could one know the influence of a producer ex ante?
- [ ] Understanding the relative influence and contribution of peers is crucial for designing effective incentive mechanisms and ensuring fair resource allocation. One approach to assess participant influence is through the use of network centrality measures, which evaluate the importance of nodes based on their position and connectivity within the network graph.
- [ ] What algorithm can we use to compute "peer influence" for handling token redistributions?
- [ ] I like the idea of a graph that is self-regulating. If a producer can have a negative impact on the token rewards of their peers by being lazy or malicious, the network might naturally dislodge bad actors. What might the math look like here? What is the interplay between reputation and token redistributions, if any?
- [ ] I also like the idea that you can earn tokens from your peers edges for having many connections in the graph. This increases the likelihood that peers will market their services.

___

### Arbitration, Insurance, and Reputation

**Decentralized Arbiters Network**: In the case of a dispute, a decentralized network of arbiters provides a resolution service.

**Incentives for Arbiters**: Arbiters are eligible to earn the block reward that would have otherwise been earned for creating the transaction, as well as a portion of the tokens slashed from the edge weights in the transaction graph.

**Consequences for Losing Party**: The losing party in a dispute can have the edge weights in their transaction graph slashed or burned, harming their future earning potential in the network. This mechanism reduces the frequency of false claims by economically rational actors.

**Reputation Storage**: Reputation of participants is stored in a distributed hash table (DHT) or as a series of [on-chain attestation contracts](https://github.com/ethereum-attestation-service/eas-contracts/tree/master) 

**Reputation Incentives and Consequences**: Malicious producers who lose disputes frequently or perform lazily will acquire lower reputation scores, making them less likely to be discovered or prioritized in search requests. Service purveyors who renege on their commitments or provide sub-par services can face consequences such as reduced eigenvector centrality scores, higher insurance costs, and potential slashing of their edge weights in the transaction graph. Lazy providers who consistently fail to meet quality of service (QoS) guarantees will see their reputation scores and eigenvector centrality decline, leading to reduced visibility, higher transaction costs, or blacklisting.

**Reputation-Based Insurance Fees**: When a Producer and a Buyer create an escrow contract, they can optionally choose to insure their transaction in the case of a dispute. The protocol could implement a reputation-based insurance system, where participants with a strong reputation and low dispute history tend to be eligible for a lower cost of insurance. Over time, good-faith actors are rewarded with lower fees. This incentivizes good behavior and reduces the likelihood of false positive claims.


#### Action items:
- [ ] What is the interplay, if any, between the reputation system and the marginal block rewards for new transactions? How do arbiters earn rewards? Do they have a reason to hold tokens, or will they just sell?
- [ ] What is the math behind the arbitration process? How much of the edge weights are slashed and why? 
- [ ] Who is expected to play the role of the arbiter, how do they gather information about the history of participants, etc?

___

### Service-Proofs
For last-mile delivery and ridesharing services, we introduce a layered approach combining various techniques to achieve proof-of-service verification; mitigating collusion and self-dealing risks.

**Identity Proofs**: Providers and customers must verify their identities using a privacy-preserving, identity technique, which employs zero-knowledge proofs to confirm their uniqueness without disclosing personally revealing information. This prevents self-dealing, where a single entity creates multiple identities to collude with themselves and earn rewards.

**Code Exchange and Location Proofs**: The network generates unique, one-time codes for each service request. Providers must physically meet with the buyer and exchange the code to prove service completion. Both the provider's and customer's devices generate zero-knowledge location proofs at the time of code exchange using a location proof from GPS data emitted from each parties device. The location proofs verify that the provider and customer were in close proximity without revealing their actual locations.

**Multi-signature Escrow**: A multi-signature escrow system is implemented for transactions, where funds are held in escrow until a mutual attestation resolves to confirm the successful completion of the service. This mechanism ensures that producers are rewarded only after delivering the agreed-upon services, and buyers receive what they paid for. If there is not a mutual attestation, then we have a dispute in which an insurance provider is able to earn the block reward that was otherwise allocated for the service provider for resolving the service dispute.

**Collusion Risk Assessments**: The network tracks the interactions between providers and customers over time, forming a bipartite transaction graph. Providers who honestly interact with a diverse set of unique customers (verified through a decentralized identity system) have a lower collusion risk score. Providers with lower collusion risk scores are eligible for asymmetric rewards. The design mandates that supply and demand grow in lockstep in order to make providers eligible for asymmetrically large rewards. Rewards are also capped per reward epoch (e.g., daily, weekly). Service providers with low collusion risk scores and high reputation can earn large block rewards without the code exchange process. We make probability assumptions about the feasibility of large populations simultaneously engaging in collusion and assume that the physical work required to have many parties simultaneously engaging in false service creation is high enough to make it statistically improbable. So our model assumes an allowance for some risk. 

**Encrypted Service Requests**: Jobs or tasks that are sent to producers are encrypted, not disclosing any information about the identity of the customer until after the service request is accepted. The encrypted service requests mechanism aims to create an environment of imperfect information, where producers have limited knowledge about the identity of the customer. This uncertainty makes it more challenging for producers to engage in cooperation with specific customers, as they cannot reliably identify cooperating agents.
Random Assignment: To prevent collusion between providers and customers, the network employs a random assignment mechanism that matches encrypted service requests with eligible providers based on predefined criteria. This double-blind system ensures that neither the provider nor the customer can predict or influence the matching process, making it difficult for them to collude. Note: this only applies to networks that provide commodity services, like delivery networks.

**Lazy Provider Slashing**: If a provider fails to respond to a service request or provides an invalid or incomplete response, it is considered a protocol violation. Penalties are imposed, such as damaging the provider's reputation (making it less likely to be included in search requests), or slashing their edge weights in the transaction graph. Repeated failures or violations can lead to more severe penalties, like permanent removal from the network, or blacklisting. Lazy Providers that consistently reject orders after they are placed will have their edges slashed.

**Multi-Layered Challenge Broadcasts**: a verification system where challenges are sequentially layered and require the next service provider (e.g., the driver) to decode and forward the challenge, verifying their part of the service. Each participant (restaurant, driver) must decode their part of the challenge and pass it on correctly to prove their service was performed as claimed. Inspired by helium and the Guided Tour Protocol Puzzle for DoS attacks? 


## References
- [Eigenvector centrality](https://en.wikipedia.org/wiki/Eigenvector_centrality#:~:text=Eigenvector%20centrality%20is%20a%20measure,will%20have%20high%20eigenvector%20centrality.)
- [Shapley Values](https://en.wikipedia.org/wiki/Shapley_value#Value_of_a_player_to_another_player)
- [Kleros Arbitration Network](https://kleros.io/whitepaper.pdf) 
- [Ethereum Attestation Service](https://github.com/ethereum-attestation-service/eas-contracts/tree/master)


