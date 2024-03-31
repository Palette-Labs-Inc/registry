# RFC: Data Repositories

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-30-2024
- **Last supportd:** 03-30-2024

## Abstract
A data repository is a collection of data stored (publicly or privately) by a user. Repositories contain self-authenticating data structures, meaning each creation or update of a piece of content is signed, canonical, live, transactable, and can be independently verified by any third party regardless of the storage location of the data.

## Introduction
Data repositories are essentially your own personal git repository that only you (or a [delegated signer](./00003-identity-contracts.md#signature-authority-registry)) are able to modify.   

The content of a repository is stored in a [Merkle Search Tree (MST)](https://hal.inria.fr/hal-02303490/document):
```
┌────────────────┐
│     Commit     │  (Signed Root)
└───────┬────────┘
        ↓
┌────────────────┐
│   Tree Nodes   │
└───────┬────────┘
        ↓
┌────────────────┐
│     Record     │
└────────────────┘
```

Every node is an [IPLD](https://ipld.io/) object ([dag-cbor](https://ipld.io/docs/codecs/known/dag-cbor/)).

## Motivation
1. *Portability*: if any `Node Operator` fails to maintain it's service, begins charging high fees, or has performance failures, users are free to switch to a new managed host provider (`Node Operator`), including to their own infrastructure. Because, 1. it is easy to switch hosts, 2. it is easy for anyone to operate a `Node Operators`, `Node Operators` will be able to charge *the exact rent* that their service can justify in an open market. 

2. *Scale*: Self-authenticating data provides a scalability advantage by enabling data to be cached and forwarded from one intermediate point to another within a network. Store-and-forward cache patterns can allow for untrusted aggregation services (similar to an infura or alchemy or our [indexing service](../apps/registry-indexing-service/)) to compute over data on behalf of smaller providers without reducing trust in the data's authenticity. Aggregators can then develop large data services, computed views like recommendation engines, global indexes, reputation networks, routing and logistics services, insurance services, and other systems that might require global network views in a commercial setting.

3. *Trust*: Self-authenticating data allows trust to reside in the data itself, widening the set of storage and computational possibilities to a much broader set of possible providers. Such features significantly widen the possibility of the network. Society can contribute idle cognitive resources (say an algorithm), or idle computational resources (unallocated compute on local devices). Such properties allow most value for the network to accrue to it's users. 

## Proposal
We propose a repository data structure that is content-addressed (a [Merkle-tree](https://en.wikipedia.org/wiki/Merkle_tree)), and where every mutation of repository contents (eg, addition, removal, and updates to records) results in a new commit `data` hash value (CID). Commits are cryptographically signed, with rotatable signing keys, which allows recursive validation of content as a whole or in part (beginning from a specific branch in the tree).

## Examples

(Optional) If applicable, provide details about the implementation of the proposal, including any prototypes, code snippets, or reference implementations.

## References

List any references such as existing RFCs, standards documents, or academic papers that were cited or used in the creation of this RFC.

