# RFC: Data Structures

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
Records and messages need to be stored, transmitted, encoded, and decoded in a consistent way to promote interoperability in distributed systems in a unifying way.  

## Introduction
A more detailed explanation of the problem and why it is important to address it. This section should provide enough background to understand the context of the RFC.

When data needs to be authenticated (signed), referenced (linked by content hash), or stored, it can be encoded into [Concise Binary Object Representation (CBOR)](https://cbor.io/). CBOR is an [IETF](https://www.ietf.org/about/introduction/) standard roughly based on JSON. IPLD or the [Interplanetary Linked Data (IPLD)](https://ipld.io/docs/data-model/), defines a specification for hash-linked data structures and a standard data model for interoperable protocols from the IPFS ecosystem. 

IPLD also specifies a normalized subset of CBOR called **[DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/),** which is what we intend to use. DAG-CBOR is typically considered to be fast. It's a binary, length-prefixed format. These traits usually associate with good performance.[[1](https://ipld.io/docs/codecs/known/dag-cbor/#performance)]. DAG-CBOR is not very human friendly. It's a binary, length-prefixed format. While these traits contribute to its performance, they do not make it easy to edit.[[2](https://ipld.io/docs/codecs/known/dag-cbor/#human-friendliness)]. Because of the on-demand nature of the emergent markets within the network (like rideshare or delivery), we optimize for performance. Depending on feedback from the community, we may update these standards to help with human-friendliness and logging.

In IPLD, distinct pieces of data are called **nodes,** and when encoded in binary (DAG-CBOR) result in a **block.** A node may have internal nested structure (maps or lists). Nodes may reference each other by string URLs or URIs, just like with regular JSON on the web. In IPLD, they can also reference each other strongly by hash, referred to in IPLD as a **link.** A set of linked nodes can form higher-level data structures like [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) or [Directed Acyclical Graphs (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph). Links can also refer to arbitrary binary data (blobs).

## Motivation

Describe the motivation behind this proposal. Explain why the existing solutions are inadequate and how the proposed solution addresses the problem.

## Proposal

The main content of the RFC:
- Detailed description of the proposed solution or standard.
- Technical specifications and design details.
- Examples of how the solution would work in practice.

## Examples

(Optional) If applicable, provide details about the implementation of the proposal, including any prototypes, code snippets, or reference implementations.

## References

List any references such as existing RFCs, standards documents, or academic papers that were cited or used in the creation of this RFC.

