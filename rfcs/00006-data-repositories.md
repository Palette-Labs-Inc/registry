# RFC: Data Repositories

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-30-2024
- **Last supportd:** 03-30-2024

## Abstract
A data repository is a collection of data stored (publicly or privately) by an agent. Repositories contain self-authenticating data structures, meaning each creation or update of a piece of content is signed, canonical, live, transactable, and can be independently verified by any third party regardless of the storage location of the data.

## Introduction
In computer science, an authenticated data structure is one that can attest to it's own authenticity. Self-authenticated data can have it's operations carried out by an untrusted prover and any independently verifier can verify it's authenticity by generating a compact proof. Such data structures can then support outsourcing data processing and other tasks to untrusted `Node Operators` without an integrity sacrifice. These processes allow trust to be in the hands of the user instead of a host or trusted webserver.  

This is a departure from the pervasive client-to-server architecture models of the modern Web. When information is host-certified it becomes dead when it is no longer hosted. Self-authenticating data structures move authority to the user and therefore preserve the liveness of data independent of the storage location. Such properties are desirable in distributed systems when you want to push power and control to the edges of the network (away from central authorities, and back to the network's agents).

Self-authenticating data structures can be satisfied by two properties:
_[Content-addressed data](https://en.wikipedia.org/wiki/Content-addressable_storage)_ means that all data created in the network are passed through a [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function) to generate a unique digital "fingerprint" of a piece of content. Using public keys and content-addresses, we sign all content by the `agent`s signature. For any piece of content, this signing process will always generate the same "fingerprint". All attemps to store this content will always generate the same "fingerprint". Because changing the file will result in a new "fingerprint", we can know that the data was never tampered with during transport. This process allows trust to reside in the data itself, rather than where the content is located. 

_[Digital Signatures](https://en.wikipedia.org/wiki/Digital_signature)_ [Self-sovereign identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) as discussed in the [identity contracts RFC](./00003-identity-contracts.md), associate `agents` with a key pair that give them control over their content without a trust sacrifice. As such, control of an account is proved by a cryptographic signature from the `agent`, rather than an entry in a database.

## Motivation
Web2 marketplaces tend to be [rent-seeking](https://en.wikipedia.org/wiki/Rent-seeking), charging asymmetric fees relative to the value of the services they provide. These networks create negative externalities on society, reduce economic efficiency, prevent emerging markets, and fail to adequately fill incentive gaps in networks. 

**This proposal optimizes for the following three properties:**
1. *Portability*: if any `Node Operator` fails to maintain it's service, begins charging high fees, or has performance failures, users are free to switch to a new managed host provider (`Node Operator`), including to their own infrastructure. Because, 1. it is easy to switch hosts, 2. it is easy for anyone to operate a `Node Operators`, `Node Operators` will be able to charge *the exact rent* that their service can justify in an open market. 
2. *Scale*: Self-authenticating data provides a scalability advantage by enabling data to be cached and forwarded from one intermediate point to another within a network. Store-and-forward cache patterns can allow for untrusted aggregation services (similar to an infura or alchemy or our [indexing service](../apps/registry-indexing-service/)) to compute over data on behalf of smaller providers without reducing trust in the data's authenticity. Aggregators can then develop large data services, computed views like recommendation engines, global indexes, reputation networks, routing and logistics services, insurance services, and other systems that might require global network views in a commercial setting.
3. *Trust*: Self-authenticating data allows trust to reside in the data itself, widening the set of storage and computational possibilities to a much broader set of possible providers. Such features significantly widen the possibility of the network. Society can contribute idle cognitive resources (say an algorithm), or idle computational resources (unallocated compute on local devices). Such properties allow most value for the network to accrue to it's users. 

## Proposal
We propose a repository data structure that is content-addressed (a [Merkle-tree](https://en.wikipedia.org/wiki/Merkle_tree)), and where every mutation of repository contents (eg, addition, removal, and updates to records) results in a new commit `data` hash value (CID). Commits are cryptographically signed, with rotatable signing keys, which allows recursive validation of content as a whole or in part (beginning from a specific branch in the tree).

## Examples

(Optional) If applicable, provide details about the implementation of the proposal, including any prototypes, code snippets, or reference implementations.

## References

List any references such as existing RFCs, standards documents, or academic papers that were cited or used in the creation of this RFC.

