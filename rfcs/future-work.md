# Future concepts to explore:
-  "decentralized micro-services", essentially opening a market for any computational task related to a commercial transaction (tax calculations, recommendations, routing + logistics) with the [everywhere computer](http://everywhere.computer/)
- UCAN for authorizing your personal data node to route only specific information on your behalf
- privacy preservation in data repo


## Currently Undefined (and required) Technical Specifications before the system can be permissionless.
3. Payments, escrow contracts.
	1. Would makes sense to have a smart contract where each side "stakes" the full or partial amount of a payment related to the transaction in a "contract with consequences", meaning if one party fails to fulfill their end of the bargain, funds would be slashed. 
	2. Payments could be done in USDC. We then plan to charge a partial protocol fee that can be used to burn and mint tokens in an open market and distribute back to contributors relative to their contributions over a reward epoch.
4. Reputation
	1. Subjective claims or attestations, like a yelp review about infrastructure providers. this is easy and can use something like EAS.
	2. The other, is a global consensus layer for service reliability that consumes "proofs" of technical specifications like server performance, latency and availability. This information could then be used by indexing services to filter our unreliable instances so that they can grant users a service guarantee. 
5. Order remediation, disputes, and arbitration in distributed systems.
	1. Two nodes are engaged in a transaction. Sending Node attests: "I would like to order". Receiving Node attests: "order received, I have now sent the order". Sending Node attests: "Order was never received". Receiving Node attests: "Yes it was, look I sent it". We have a dispute. Who is the independent authority that arbitrates such disputes?  
	2. You could imagine there are rule sets or methods that ingest a combination of proofs and collapse claims with resolvers. 
	3. You could imagine that there are game theoretic ways to solve for these problems. 
6. Privacy and Account Portability
	1. **Case study 1:**
		- Alice signs up for Client App Nosh
		- Alice inputs shipping address, her shipping address is stored in `BSN(x)` (buyer side backend server)
		- Client Nosh saves Shipping Address, data is content addressed in `BSN(x)`
		- Alice authorizes Client App Chomp to use her data
	2. **Case study 2:**
		- Bob signs up for `PSN` GrubDash.
		- `PSN` GrubDash goes down, has performance or latency issues, or begins charigng exorbinant fees.
		- Bob redirects his identity to `PSN` DelishEats
		- The switch from `PSN` GrubDash to `PSN` DelishEats does not require permission from `PSN` GrubDash.
		- `PSN` DelishEats now fulfills Bob's needs.
