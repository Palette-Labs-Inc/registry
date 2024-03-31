# RFC: Data Models

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
Records and messages need to be stored, transmitted, encoded, and decoded in a consistent way to promote interoperability in distributed systems. This document proposes the adoption of the [IPLD standard]([Interplanetary Linked Data (IPLD)](https://ipld.io/docs/data-model/)) for the networks data models.

## Motivation
The IPLD data model is similar to JSON -- with addiditional types for bytes, and links. These additional properties are useful for defining linked data structures in distributed systems and allowing anyone to explore data regardless of the underlying protocol. Common type representations can then be easily representable by common programming languages. Such a standard creates low friction for tooling and libraries within the protocol network.

Our motivation for standardizing data models is largely the same as the [raw IPLD Data Model motivation](https://ipld.io/docs/data-model/#motivation). 

Note, we **do not strictly adhere* to the [raw IPLD data model definitions](https://ipld.io/docs/data-model/kinds/). The core nosh data model is based on the IPLD specification but we make a few modifications and define specific types for our network.  

## Proposal
When data needs to be authenticated (signed), referenced (linked by content hash), or stored, it can be encoded into [Concise Binary Object Representation (CBOR)](https://cbor.io/). CBOR is an [IETF](https://www.ietf.org/about/introduction/) standard roughly based on JSON. IPLD or the [Interplanetary Linked Data (IPLD)](https://ipld.io/docs/data-model/), defines a specification for hash-linked data structures and a standard data model for interoperable protocols from the IPFS ecosystem. 

IPLD specifies a normalized subset of CBOR called **[DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/),** which is what we intend to use. DAG-CBOR is typically considered to be fast. It's a binary, length-prefixed format. These traits usually associate with good performance.[[1](https://ipld.io/docs/codecs/known/dag-cbor/#performance)]. DAG-CBOR is not very human friendly. It's a binary, length-prefixed format. While these traits contribute to its performance, they do not make it easy to edit.[[2](https://ipld.io/docs/codecs/known/dag-cbor/#human-friendliness)]. Because of the on-demand nature of the emergent markets within the network (like rideshare or delivery), we optimize for performance. Depending on feedback from the community, we may update these standards to help with human-friendliness and logging.

In IPLD, distinct pieces of data are called **[nodes](https://ipld.io/docs/data-model/node/),** and when encoded in binary (DAG-CBOR) result in a **[block](https://ipld.io/docs/data-model/node/#nodes-vs-blocks).** A node may have internal nested structure (maps or lists). 

Nodes may reference each other by string URLs or URIs, just like with regular JSON on the web. In IPLD, they can also reference each other strongly by hash, referred to in IPLD as a **link.** A set of linked nodes can form higher-level data structures like [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) or [Directed Acyclical Graphs (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph). 

For our purposes, we modify the raw IPLD formats as follows:

### Data Types

| Nosh Type    | IPLD Type | JSON                 | CBOR                    | Mods                    |
| ------------ | --------- | -------------------- | ----------------------- | ----------------------- |
| `null`       | null      | Null                 | Special Value (major 7) | strict IPLD format      |
| `boolean`    | boolean   | Boolean              | Special Value (major 7) | strict IPLD format      |
| `integer`    | integer   | Number               | Integer (majors 0,1)    | signed, 64-bit          |
| `string`     | string    | String               | UTF-8 String (major 3)  | Unicode, UTF-8          |
| -            | float     | Number               | Special (major 7)       | disallowed              |
| `bytes`      | bytes     | `$bytes` Object      | Byte String (major 2)   | strict IPLD format      |
| `cid-link`   | link      | `$link` Object       | CID (tag 42)            | CID                     |
| `array`      | list      | Array                | Array (major 4)         |                         |
| `object`     | map       | Object               | Map (major 5)           | keys are always strings |
| `blob`       | -         | `$type: blob` Object | `$type: blob` Map       | an image or file        |

**The following types strictly adhere to original IPLD Data model definitions:**
- [Null kind](https://ipld.io/docs/data-model/kinds/#null-kind)
- [Boolean kind](https://ipld.io/docs/data-model/kinds/#boolean-kind)
- [Integer kind](https://ipld.io/docs/data-model/kinds/#integer-kind)
- [String kind](https://ipld.io/docs/data-model/kinds/#string-kind) 
- [Bytes kind](https://ipld.io/docs/data-model/kinds/#bytes-kind)

**The following types are removed from the original IPLD Data model definitions:**
- [Float kind](https://ipld.io/docs/data-model/kinds/#float-kind)

**Notes on floats**:
It is [explicitly stated](https://ipld.io/design/tricky-choices/numeric-domain/#floating-point) in the IPLD Float Kind documentation to completely avoid Floats when developing systems on IPLD. To make things easier, we simply remove the reference to avoid complexities in implementations of the protocol. Content-addressing works best where the content being addressed has a stable meaning for the address it produces. Alternative methods for representing this meaning, or for encoding fractional numbers with greater precision and less variability, are used instead. What this means in practice is that currency values are represented universally in the lowest common denominator of the local currency. 


**The following types are modified from the original IPLD Data model definitions:**
- [Link kind](https://ipld.io/docs/data-model/kinds/#link-kind): renamed to cid-link to make clear that all links are CIDs
- [Map kind](https://ipld.io/docs/data-model/kinds/#map-kind): renamed to object
- [List kind](https://ipld.io/docs/data-model/kinds/#list-kind): renamed to array

**The following types are added to the original IPLD Data model definitions:**
- blob

### Nullable and False-y
In our data model proposal there is a semantic difference between explicitly setting an map field to `null` and not including the field at all. Both JSON and CBOR have the same distinction.

Null or missing fields are also distinct from "false-y" value like `false` (for booleans), `0` (for integers), empty lists, or empty objects.
We add a blob type to represent a specific IPLD map for content. This type is specifically useful for descriptions of arbitrary physical objects or entitites within the network such as catalog items. Blobs are self-describing data structures that include references to metadata about the file object.

### Extended `blob` Type Notes
Blob nodes are objects with following fields:
- `$type` (string, required): fixed value `blob`. Note that this is not a valid NSID.
- `ref` (link, required): CID reference to blob, with multicodec type `raw`. In JSON, encoded as a `$link` object as usual
- `mimeType` (string, required, not empty): content type of blob. `application/octet-stream` if not known
- `size` (integer, required, positive, non-zero): length of blob in bytes


## Examples

(Optional) If applicable, provide details about the implementation of the proposal, including any prototypes, code snippets, or reference implementations.

## References
- [IPLD Data Model Documentation](https://ipld.io/docs/data-model/)
- [IPLD Schemas Documentation](https://ipld.io/docs/schemas/)
- [IPLD Data Model Documentation](https://ipld.io/docs/data-model/)
- [Bsky](https://atproto.com/specs/data-model#data-model)
- [Directed Acyclical Graphs (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
- [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree)