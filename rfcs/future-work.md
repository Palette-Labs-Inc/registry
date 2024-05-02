## mechanism design
Public data about users is stored in "personal data stores" ([PDS](./00006-data-repositories.md)). These are essentially personal git repos where users store their information. [Identities](./00003-identity-contracts.md) are stored on-chain. All personal data stores are web-servers. The location of the hosted web-server is referenced by a url within an [on-chain registry](./00002-node-registry.md). Indexers can crawl the registry and the user repos to acquire global state of the network.

The PDS acts as a generic proxy between services. When a buyer and a seller agree to transact, the buyer PDS will create a signed ["attestation"](https://attest.org/) (on or off chain) of their intent to purchase. The seller PDS will sign this attestation, representing an affirmative capacity to fulfill the intent. When the fulfillment is complete, both parties will sign another attestation referencing the original with a boolean "true". These attestations will be submitted and a smart contract will resolve to mint tokens to the contributors of this revenue contribution.

## The goal of the token: 
- increase the number of transactions in the network
- increase the frequency of the transactions between buyers and sellers in the network
- increase the dollar amount of the transactions between buyers and sellers in the network
- bootstrap supply and demand in new networks
- token issuance need to reach equilibrium in a mature state of any network such that any reward is paid out in proportion to revenue contributions
- should naturally capture the unique requirements of each market dynamically
- we do not think that our stakeholders will care at all about governance

## Constraints:
Our primary constraint is that there is no cryptographic way to prove real-world activities. This could limit the scope of our design to rewarding token distributions from a protocol-fee. Unless we do KYC of all of the participants in the network, users could create identities as both a buyer and a seller in the network, create transactions with themselves and earn a token reward for self-dealing. Such interactions should not be profitable but this limits the scope of our design space. Any thoughts?

## Current state of the token model:
- We're modeling the token network as a dynamic transaction graph. 
- The transaction graph captures the implicit properties of the network, it's agents, and their relationships. In hyperlocal networks like local delivery for example, we don't need to define the number of tokens allocated for each geography - the geographic considerations and hyperlocal nature of the network is implicit in the transaction graph which I view as an elegant design. 
- We're exploring ideas from [cooperative game theory](https://en.wikipedia.org/wiki/Cooperative_game_theory). Specifically, how can any group of individuals form a coalition to maximally benefit all participants? We're particularly interested in exploring the [Shapley Value](https://en.wikipedia.org/wiki/Shapley_value) solution concept.

## Nuance / future-proofing:
- The protocol will support an arbitrary buyer and seller network. For example, In food delivery, there are 3 agents: consumer, merchant, and driver. The protocol, however, only models a buyer and a seller. In a food delivery transaction, the buyer purchases a good from one seller (the merchant), and a service (delivery) from another seller (the courier). 
- The economic relationship between the buyer and the merchant is much different than that of the buyer and the courier. Specifically, the courier provides a commodity service. If one assumes that all drivers perform an equal service, then all drivers are replaceable by any other driver. 
- In the case of the merchant, you can imagine "marquee merchants" that do not have substitutes. These are the best restaurants in any given town. These sellers introduce "economic gravity" into a local market. 
- A token with nice properties would implicitly capture the unique economic incentives of all possible emerging markets without explicitly enumerating all potential service providers.
- A bad token design would attempt to "predetermine" all possible emergent markets (rideshare, real-estate sales, facebook marketplace) and design unique mechanisms for each predefined market. Such a design would be limiting the potential of the networks emergent markets.
- The design should implicitly capture the economic dynamics of different networks at different states of maturity.

## Monetary Policy
- How and when are tokens minted and issued?
- Is there a limited supply of tokens, or a limitless supply of tokens? Why?

## Utility
- How are tokens used within the network after they are received? If all recipients simply spend their tokens, this will have negative pricing pressures on the network. How to protect against this? Any useful insights?
- If the network can support an infinite number of different markets, how do we ensure the utility of the token isn't too tightly defined? 

## Sinks and Faucets:
- We have a good idea of our sinks, but what are our faucets? How are tokens used? We might develop ways for tokens to be used in food delivery, but how would they be used in ride-share? Can we have a developer ecosystem emerge to define token utility, or should this be implicit in the design? Why?

## Reputation / Arbitration / Disputes and Insurance Providers
- When a `buyer` communicates with a `seller`, how can each have assurances that the service that is being requested will be fulfilled? One way to establish trust is to have a "registrar" where we (Nosh) serve the role of "approving" applicants to join the registry (and hence we permit which service providers can be discovered by the network). However, this adds permissions and goes against our values of designing a credibly neutral protocol. A game theoretic approach would be much better. What mechanisms can perform this task? You could imagine that, during each transaction between a buyer and a seller, there is an "escrow contract" that resolves after a transaction is fulfilled. This requires consensus from both the buyer and the seller which begs the question of how disputes are handled, and how we can "verify fulfillment" in a distributed network.
- Is there an economic punishment for failing to fulfill a service? How would this work within the rest of the design?
- If a buyer complains about the quality of service (requesting a refund, for example) what is our dispute or resolution protocol? Can it be trustless?
- For disputes, we are thinking of introducing the concept of an insurance provider.

## References
- [Ethereum Attestation Service](https://attest.org/)
- [cooperative game theory](https://en.wikipedia.org/wiki/Cooperative_game_theory)
- [Shapley Value](https://en.wikipedia.org/wiki/Shapley_value)
