# RFC: Data Repositories

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-30-2024
- **Last supportd:** 03-30-2024

## Abstract
A data repository is a collection of data stored (publicly or privately) by a user. Repositories contain self-authenticating data structures, meaning each creation or update of a piece of content is signed, canonical, live, transactable, and can be independently verified by any third party regardless of the storage location of the data.

## Motivation
1. *Portability*: if any `Personal Data Store` fails to maintain it's service, begins charging high fees, or has performance failures, users are free to switch to a new managed host provider (`Personal Data Store`), including to their own infrastructure. Because, 1. it is easy to switch hosts, 2. it is easy for anyone to operate a `Personal Data Stores`, `Personal Data Stores` will be able to charge *the exact rent* that their service can justify in an open market. 

2. *Scale*: Self-authenticating data provides a scalability advantage by enabling data to be cached and forwarded from one intermediate point to another within a network. Store-and-forward cache patterns can allow for untrusted aggregation services (similar to an infura or alchemy or our [indexing service](../apps/registry-indexing-service/)) to compute over data on behalf of smaller providers without reducing trust in the data's authenticity. Aggregators can then develop large data services, computed views like recommendation engines, global indexes, reputation networks, routing and logistics services, insurance services, and other systems that might require global network views in a commercial setting.

3. *Trust*: Self-authenticating data allows trust to reside in the data itself, widening the set of storage and computational possibilities to a much broader set of possible providers. Such features significantly widen the possibility of the network. Society can contribute idle cognitive resources (say an algorithm), or idle computational resources (unallocated compute on local devices). Such properties allow most value for the network to accrue to it's users. 

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

## Proposal
In the nosh-protocol architecture, the authoritative location of an account's repository is an `account`'s associated **Personal Data Stores (PDS)**. An accounts current PDS location is indicated in the `Account Registry`

We propose a repository data structure that is content-addressed (a [Merkle-tree](https://en.wikipedia.org/wiki/Merkle_tree)), and where every mutation of repository contents (eg, addition, removal, and updates to records) results in a new commit `data` hash value (CID). Commits are cryptographically signed, with rotatable signing keys, which allows recursive validation of content as a whole or in part (beginning from a specific branch in the tree).

User records are stored in per-account repositories (frequently shortened to **repo**). All currently active records are stored in the repository, and current repository contents are publicly available, but both record deletions and account deletions are fully supported.

**Important Note**, we are working on E2EE solutions and session-based user controls to securely store private data in repos without disclosing information about addresses and other sensitive information.

The repository data structure is content-addressed (a [Merkle-tree](https://en.wikipedia.org/wiki/Merkle_tree)), and every mutation of repository contents (eg, addition, removal, and updates to records) results in a new commit `data` hash value (CID). Commits are cryptographically signed, with rotatable signing keys, which allows recursive validation of content as a whole or in part.

Repositories and their contents are canonically stored in binary [DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/) format, as a graph of [IPLD](https://ipld.io/docs/data-model/) data objects referencing each other by content hash (CID Links). Large binary blobs are not stored directly in repositories, though they are referenced by hash ([CID](https://github.com/multiformats/cid)). This includes media objects and files as represented by blobs. Repositories can be exported as [CAR](https://ipld.io/specs/transport/car/carv1/) files for offline backup, account migration, or other purposes.

In real-world use, it is expected that individual repositories will contain anywhere from dozens to millions of records, depending on the commercial setting.

## Repo Data Structure
At a high level, a repository is a key/value mapping where the keys are path names (as strings) and the values are records (DAG-CBOR objects).

A **Merkle Search Tree** (MST) is used to store this mapping. This content-addressed deterministic data structure stores data in key-sorted order. It is reasonably efficient for key lookups, key range scans, and appends (assuming sorted record paths). The properties of MSTs in general are well described here:
> Alex Auvolat, François Taïani. Merkle Search Trees: Efficient State-Based CRDTs in Open Networks. SRDS 2019 - 38th IEEE International Symposium on Reliable Distributed Systems, Oct 2019, Lyon, France. pp.1-10, ff10.1109/SRDS.2019.00032 ([pdf](https://inria.hal.science/hal-02303490/document))

The specific details of the MST as used in nosh-protocol repositories are described below.

Repo paths are strings, while MST keys are byte arrays. Neither may be empty (zero-length). While repo path strings are currently limited to a subset of ASCII (making encoding a no-op), the encoding is specified as UTF-8.

Repo paths currently have a fixed structure of `<collection>/<record-key>`. This means a valid, normalized [RDSID](./00009-namespace-identifiers.md), followed by a `/`, followed by a valid [Record Key](./00007-record-keys.md). The path should not start with a leading `/`, and should always have exactly two path segments. The ASCII characters allowed in the entire path string are currently: letters (`A-Za-z`), digits (`0-9`), slash (`/`), period (`.`), hyphen (`-`), underscore (`_`), and tilde (`~`). The specific path segments `.` and `..` are not valid RDSIDs or Record Keys, and will always be disallowed in repo paths.

Note that repo paths for all records in the same collection are sorted together in the MST, making enumeration (via key scan) and export efficient. Additionally, the TID Record Key scheme was intentionally selected to provide chronological sorting of MST keys within the scope of a collection. Appends are more efficient than random insertions/mutations within the tree, and when enumerating records within a collection they will be in chronological order (assuming that TID generation was done correctly, which cannot be relied on in general).

### Commit Objects
The top-level data object in a repository is a signed commit. The [IPLD schema](https://ipld.io/docs/schemas/) fields are:
- `aid` (string, required): the [`account identifier`](./00003-identity-contracts.md#account-identifiers) associated with the repo
- `version` (integer, required): fixed value of `1` for this repo format version
- `data` (CID link, required): pointer to the top of the repo contents tree structure (MST)
- `rev` (string, TID format, required): revision of the repo, used as a logical clock. Must increase monotonically. Recommend using current timestamp as [TID](./00007-record-keys.md#record-key-type-tid); `rev` values in the "future" (beyond a fudge factor) should be ignored and not processed.
- `prev` (CID link, nullable): pointer (by hash) to a previous commit object for this repository. Could be used to create a chain of history, but largely unused (included for v2 backwards compatibility). In version `1` repos, this field must exist in the CBOR object, but is virtually always `null`.
- `sig` (byte array, required): cryptographic signature of this commit, as raw bytes.

An `UnsignedCommit` data object has all the same fields except for `sig`. The process for signing a commit is to populate all the data fields, and then serialize the `UnsignedCommit` with [DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/). The output bytes are then hashed with [SHA-256](https://en.wikipedia.org/wiki/SHA-2), and the binary hash output (without hex encoding) is then signed using the current "private key" (signing key) for the account or the signing key of a [delegated signature authority](./00003-identity-contracts.md#signature-authority-registry) for the account. The signature is then stored as raw bytes in a commit object, along with all the other data fields.

The CID for a commit is generated by serializing a _signed_ commit object as [DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/). See notes on the "blessed" CID format below, and in particular be sure to use the `dag-cbor` multicodec for CIDs linking to commit objects.

Note that neither the signature itself nor the signed commit inform the type of key used (the elliptical curve type), or the public key used. That information must be fetched from the [`Identity Contracts`](./00003-identity-contracts.md).

With key rotation or [revoked delegation to a signature authority](./00003-identity-contracts.md#signature-authority-registry), verification of older commit signatures can become ambiguous. In future versions, we plan to improve verification methods of old commits based on global revokation timestamps emitted from the [`Signautre Authority Registry`](./00003-identity-contracts.md#signature-authority-registry). When an `Account` revokes a delegated signer, all commits signed by the signing key of the delegated signer that occur after the revokation timestamp should be invalidated.

The most recent commit should always be verifiable using the current [`Identity Contracts`](./00003-identity-contracts.md). This implies that a new repository commit should be created every time the signing key is rotated. Key rotation commits do not need to update the `data` CID link.

### MST Structure
At a high level, the repository MST is a key/value mapping where the keys are non-empty byte arrays, and the values are CID links to records. The MST data structure should be fully reproducible from such a mapping of bytestrings-to-CIDs, with exactly reproducible root CID hash (aka, the `data` field in commit object).

Every node in the tree structure contains a set of key/CID mappings, as well as links to other sub-tree nodes. The entries and links are in key-sorted order, with all of the keys of a linked sub-tree (recursively) falling in the range corresponding to the link location. The sort order is from **left** (lexically first) to **right** (lexically latter). Each key has a **depth** derived from the key itself, which determines which sub-tree it ends up in. The top node in the tree contains all of the keys with the highest depth value (which for a small tree may be all depth zero, so a single node). Links to the left or right of the entire node, or between any two keys in the node, point to a sub-tree node containing keys that fall in the corresponding key range.

An empty repository with no records is represented as a single MST node with an empty array of entries. This is the only situation in which a tree may contain an empty leaf node which does not either contain keys ("entries") or point to a sub-tree containing entries. The top of the tree must not be a an empty node which only points to a sub-tree. Empty intermediate nodes are allowed, as long as they point to a sub-tree which does contain entries. In other words, empty nodes must be pruned from the top and bottom of the tree, but empty intermediate nodes must be kept, such that sub-tree links do not skip a level of depth. The overall structure and shape of the MST is deterministic based on the current key/value content, regardless of the history of insertions and deletions that lead to the current contents.

For the nosh-protocol MST implementation, the hash algorithm used is SHA-256 (binary output), counting "prefix zeros" in 2-bit chunks, giving a fanout of 4. 

**Hash the Key:** First, the key, which is a byte array (an array of bytes, with each byte representing a character or part of binary data), is hashed using the SHA-256 algorithm. SHA-256 is a cryptographic hash function that outputs a fixed-length (256-bit) binary string. This output is referred to as the hash or the digest of the input data.

**Count Leading Zeros:** The binary output of the SHA-256 hash is then examined to count the number of leading zeros. However, instead of counting each zero individually, they are counted in 2-bit chunks. This means you look at the hash output in groups of two bits and count how many of these groups consist entirely of zeros starting from the beginning of the hash.

**Calculate Depth:** The count of leading zeros (in 2-bit chunks) is then divided by two, rounding down if necessary. The result of this division is a positive integer that represents the depth of the key within the MST.

**Fanout of 4:** The method of counting leading zeros in 2-bit chunks relates to the tree's fanout of 4. A fanout of 4 means each node in the tree can have up to four children. The depth calculated based on the leading zeros effectively places each key at a specific level in the tree, ensuring a balanced distribution of keys across the tree's depth, based on their hash values.

Some examples, with the given ASCII strings mapping to byte arrays:
```python
import hashlib
def calculate_depth_corrected(key: str) -> int:
    # Convert the key to a byte array
    key_bytes = key.encode('utf-8')
    
    # Hash the key using SHA-256
    hash_bytes = hashlib.sha256(key_bytes).digest()
    
    leading_zeros = 0
    for byte in hash_bytes:
        if byte < 64: leading_zeros += 1
        if byte < 16: leading_zeros += 1
        if byte < 4: leading_zeros += 1
        if byte == 0:
            leading_zeros += 1
            continue
        break
    
    return leading_zeros

# Test the function with the provided keys
key1 = '2653ae71'
key2 = 'nosh'
key3 = "xyz.nosh.buyer.address/s"

depth1 = calculate_depth_corrected(key1)
depth2 = calculate_depth_corrected(key2)
depth3 = calculate_depth_corrected(key3)

depth1, depth2, depth3 # outputs (0, 1, 2), representing the unique depths for each key input
```
There are many MST nodes in repositories, so it is important that they have a compact binary representation, for storage efficiency. Within every node, keys (byte arrays) are compressed by omitting common prefixes, with each entry indicating how many bytes it shares with the previous key in the array. The first entry in the array for a given node must contain the full key, and a common prefix length of 0. This key compaction is internal to nodes, it does not extend across multiple nodes in the tree. The compaction scheme is mandatory, to ensure that the MST structure is deterministic across implementations.

The node IPLD schema fields are:
- `l` ("left", CID link, optional): link to sub-tree Node on a lower level and with all keys sorting before keys at this node
- `e` ("entries", array of objects, required): ordered list of TreeEntry objects
    - `p` ("prefixlen", integer, required): count of bytes shared with previous TreeEntry in this Node (if any)
    - `k` ("keysuffix", byte array, required): remainder of key for this TreeEntry, after "prefixlen" have been removed
    - `v` ("value", CID Link, required): link to the record data (CBOR) for this entry
    - `t` ("tree", CID Link, optional): link to a sub-tree Node at a lower level which has keys sorting after this TreeEntry's key (to the "right"), but before the next TreeEntry's key in this Node (if any)

When parsing MST data structures, the depth and sort order of keys should be verified. This is particularly true for untrusted inputs, but is simplest to just verify every time. Additional checks on node size and other parameters of the tree structure also need to be limited; see [Security Considerations](#security-considerations).

### CID Formats
The [IPFS CID](https://docs.ipfs.tech/concepts/content-addressing/#what-is-a-cid) specification is very flexible, and supports a wide variety of hash types, a field indicating the type of content being linked to, and various string encoding options. These features are valuable to allow evolution of the repo format over time, but to maximize interoperability among implementations, only a specific "blessed" set of CID types are allowed.

The blessed format for commit objects and MST node objects, when linking to commit objects, MST nodes (aka, `data`, or MST internal links), or records (aka, MST leaf nodes to records), is:
- CIDv1
- Multibase: binary serialization within [DAG-CBOR](https://ipld.io/docs/codecs/known/dag-cbor/) (or `base32` for JSON mappings)
- Multicodec: `dag-cbor` (0x71)
- Multihash: `sha-256` with 256 bits (0x12)

In the context of repositories, it is also desirable for the overall data structure to be reproducible given the contents, so the allowed CID types are strictly constrained and enforced. Commit objects with non-compliant `prev` or `data` links are considered invalid. MST Node objects with non-compliant links to other MST Node objects are considered invalid, and the entire MST data structure invalid.

More flexibility is allowed in processing the "leaf" links from MST to records, and implementations should retain the exact CID links used for these mappings, instead of normalizing. Implementations should strictly follow the CID blessed format when generating new CID Links to records.

## CAR File Serialization
The standard file format for storing IPLD data is Content Addressable aRchives (CAR). The standard repository export format for nosh-protocol repositories is [CAR v1](https://ipld.io/specs/transport/car/carv1/), which have file suffix `.car` and mimetype `application/vnd.ipld.car`.

The CARv1 format is very simple. It contains a small metadata header (which can indicate one or more "root" CID links), and then a series of binary "blocks", each of which is an IPLD object. In the context of nosh-protocol repositories:

- The first element of the CAR `roots` metadata array must be the CID of the most relevant Commit object. for a generic export, this is the current (most recent) commit. additional CIDs may also be present in the `roots` array, with (for now) undefined meaning or order
- For full exports, the full repo structure must be included for the indicated commit, which includes all records and all MST nodes
- The order of blocks within the CAR file is not currently defined or restricted. implementations may have a "preferred" ordering, but should be tolerant of unexpected ordering
- Additional blocks, including records, may or may not be included in the CAR file

When importing CAR files, note that there may existing dangling CID references. For example, repositories may contain CID Links to blobs or records in other repositories, and the IPLD blocks corresponding to those blobs or references would likely not be included in the CAR file.

The CARv1 specification is agnostic about the same block appearing multiple times in the same file ("Duplicate Blocks)". Implementations should be robust to both duplication and de-duplication of blocks, and should also ignore any unnecessary or unlinked blocks.

## References
- [IPLD schema](https://ipld.io/docs/schemas/)
- [SHA-256](https://en.wikipedia.org/wiki/SHA-2)
- [IPFS CID](https://docs.ipfs.tech/concepts/content-addressing/#what-is-a-cid)