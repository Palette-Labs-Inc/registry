# Data Models

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
Records and messages need to be stored, transmitted, encoded, and decoded in a consistent way to promote interoperability in distributed systems. This document proposes the adoption of a slightly modified [Interplanetary Linked Data (IPLD)](https://ipld.io/docs/data-model/) specification for the networks data models.

## Motivation
Content addressing through hashes has become a widely-used means of connecting data in distributed systems[^ipld]. IPLD enables decentralized data structures that are universally addressable and linkable. The data model is similar to JSON -- with convenient types for bytes, and links. These additional properties are useful for defining linked data structures in distributed systems and allowing anyone to explore data regardless of the underlying protocol. Common type representations can then be easily representable by common programming languages. Such a standard creates low friction for tooling and libraries within the nosh-protocol network.

Our motivation for standardizing data models is largely the same as the [raw IPLD Data Model motivation](https://ipld.io/docs/data-model/#motivation).

Note, we **do not strictly adhere* to the [raw IPLD data model definitions](https://ipld.io/docs/data-model/kinds/). The core nosh data model is based on the IPLD specification but we make a few modifications and define specific types for the nosh-protocol.  

## Proposal
When data needs to be authenticated (signed), referenced (linked by content hash), or stored, it can be encoded into [Concise Binary Object Representation (CBOR)](https://cbor.io/). CBOR is an [IETF](https://www.ietf.org/about/introduction/) standard roughly based on JSON. IPLD or the [Interplanetary Linked Data (IPLD)](https://ipld.io/docs/data-model/), defines a specification for hash-linked data structures and a standard data model for interoperable protocols from the IPFS ecosystem. 


When data needs to have authentication (signing), referencing (via content hash linking), or storage, it is encoded in [Concise Binary Object Representation (CBOR)](https://cbor.io/). CBOR is an [IETF](https://www.ietf.org/about/introduction/) standard and draws its design principles from JSON. The [Interplanetary Linked Data (IPLD)](https://ipld.io/docs/data-model/) introduces a specialized version of CBOR known as **[DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/), which is what we intend to use. DAG-CBOR is typically considered to be fast. It's a binary, length-prefixed format. These traits usually associate with good performance.[[1](https://ipld.io/docs/codecs/known/dag-cbor/#performance)]. DAG-CBOR is not very human friendly. It's a binary, length-prefixed format. While these traits contribute to its performance, they do not make it easy to edit.[[2](https://ipld.io/docs/codecs/known/dag-cbor/#human-friendliness)]. Because of the on-demand nature of the hypothesized transactions within the nosh-protocol network (like rideshare or delivery), we optimize for performance. Depending on feedback from the community, we may update these standards to help with human-friendliness and logging.

In IPLD, **[nodes](https://ipld.io/docs/data-model/node/),** refer to points in a graph of data. When encoded in binary (DAG-CBOR) result in a **[block](https://ipld.io/docs/data-model/node/#nodes-vs-blocks).** 

In IPLD, nodes can reference by URL or URI (as in standard JSON), and they can *also* reference each other strongly by hash, referred to in IPLD as a **link.** A set of referenced Nodes can form, [DAGs](https://en.wikipedia.org/wiki/Directed_acyclic_graph), [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree), or other complex linked data types that are useful when defining distibuted networking topologies and distributed computing architectures.

We inherit most properties from the [IPLD Data Model](https://ipld.io/docs/data-model/), with the following mods:

### Data Types

| NSDL Type    | IPLD Type | JSON                 | CBOR                    | Mods                    |
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
There's a critical semantic distinction between explicitly assigning a null value to a map field and omitting the field entirely. This distinction is mirrored in both JSON and [Concise Binary Object Representation (CBOR)](https://cbor.io/), where the treatment of null or absent fields is intentionally differentiated from "false-y" values. These "false-y" values include false (for booleans), 0 (for integers), as well as empty lists or empty objects, each carrying its own significance distinct from null or missing fields.

### Extended `blob` Type Notes
We add a blob type to represent a specific IPLD map for file content. This additional type is specifically useful for descriptions of arbitrary physical objects or entities within the network such as catalog items that will likely be represented in a variety of media formats (video, images, pdfs). Blobs are self-describing data structures that include references to metadata about themselves.

Blob nodes are objects with following fields:
- `$type` (string, required): constant value of `blob` (`blob` is not recognized as a valid RDSI)
- `ref` (link, required): This is a CID reference to a blob, specifically with a multicodec type of `raw`. Within JSON, this is represented through the `$link` object.
- `mimeType` (string, required, not empty): This specifies the content type of the blob. The default value is `application/octet-stream` in cases where the content type is unknown.
- `size` (integer, required, positive, non-zero): This field represents the length of the blob in bytes, requiring a positive, non-zero integer.

### Notes on JSON
We do not implement [IPLD DAG-JSON](https://ipld.io/docs/codecs/known/dag-json/) directly. 

The [DAG-JSON specification](https://ipld.io/docs/codecs/known/dag-json/) mentions that the only difference from regular JSON is that if you want to encode a link, you take the [CID](https://ipld.io/glossary/#cid), encode it in base58 (or base32, for CIDv0), and flank it in a map with a `"/"` key -- so it looks like this:

**Confusing DAG-JSON exmple with link refernce**
 ```json
{
    "/":"Qmfoo"
}
```

**Confusing DAG_JSON example with bytes reference**
```json
"data": {
    "/": {
      "bytes": "iVBORK21"
    }
  }
```

We introduce a modified field key for each of `link` and `bytes` types for a better developer experience (DX)

### `link`
For example, a node with a single field `"exampleLink"` with type `link` would encode in JSON and substitute `$link` as the key name instead of `/`. 
```bash
{
  "exampleLink": 
  {
    "$link": "GgoAAAA38G"
  }
}
```
And a node with a single field `"exampleBytes"` with type `bytes` would encode in JSON and substitute `$bytes`  instead of two nested objects, with outer key `/`  inner key bytes, and the same base64 encoding scheme referenced in [RFC-4648, section 4](https://datatracker.ietf.org/doc/html/rfc4648#section-4).
```bash
{
  "exampleBytes": 
  {
    "$bytes": "IaxDIBKe032"
  }
}
```

## References
- [IPLD Data Model Documentation](https://ipld.io/docs/data-model/)
- [IPLD Schemas Documentation](https://ipld.io/docs/schemas/)
- [IPLD Data Model Documentation](https://ipld.io/docs/data-model/)
- [Directed Acyclical Graphs (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
- [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree)

[^ipld]: ipld-website: https://ipld.io/#:~:text=IPLD%20is%20the%20data%20model,hashes%20as%20instances%20of%20IPLD.