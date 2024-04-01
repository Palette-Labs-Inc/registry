# RFC: Record Keys

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
A **Record Key** (sometimes shortened to `rkey`) is used to name and reference an individual record within the same collection of a [Data Repository](./00006-data-repositories.md). It ends up as a segment in URIs, and in the repo MST path. 

## Motivation
To provide a record identification system for data retrieval in [Data Repository](./00006-data-repositories.md).

## Proposal
Support for [Record Key](./00007-record-keys.md#record-key-syntax) naming schemes. Every record Lexicon schema will indicate which of the record key types should be used, depending on the needs and semantics of the record collection.

### Record Key Type: `tid`
This is the most common record naming scheme. `TID` is short for "timestamp identifier," and the name is derived from the creation time of the record.

The characteristics of a `TID` are:
- 64-bit integer
- big-endian byte ordering
- encoded as `base32-sortable`. That is, encoded with characters `234567abcdefghijklmnopqrstuvwxyz`, with no padding, yielding 13 ASCII characters.
- hyphens should not be included in a `TID` (unlike in previous iterations of the scheme)

The layout of the 64-bit integer is:
- The top bit is always 0
- The next 53 bits represent microseconds since the UNIX epoch. 53 bits is chosen as the maximum safe integer precision in a 64-bit floating point number, as used by Javascript.
- The final 10 bits are a random "clock identifier."

`TID` generators should generate a random clock identifier number, chosen to avoid collisions as much as possible (for example, between multiple worker instances of a PDS service cluster). A local clock can be used to generate the timestamp itself. Care should be taken to ensure the `TID` output stream is monotonically increasing and never repeats, even if multiple `TIDs` are generated in the same microsecond, or during "clock smear" or clock synchronization incidents. If the local clock has only millisecond precision, the timestamp should be padded. (You can do this by multiplying by 1000.)

The primary motivation for the `TID` scheme is to provide a loose temporal ordering of records, which improves storage efficiency of the repository data structure (MST).

Note: There are similarities to ["snowflake identifiers"](https://en.wikipedia.org/wiki/Snowflake_ID). In a decentralized context, the global uniqueness of `TIDs` can not be guaranteed, and an antagonistic repo controller could trivially create records re-using known `TIDs`.

### Record Key Type: `literal:<value>`
This key type is used when there should be only a single record in the collection, with a fixed, well-known Record Key.

The most common value is `self`, specified as `literal:self` in a Lexicon schema.

### Record Key Type: `any`
Any string meeting the overall Record Key schema requirements (see below) is allowed. This is the most flexible type of Record Key.

This may be used to encode semantics in the name, for example, a domain name, integer, or (transformed) AT URI. This enables de-duplication and known-URI lookups.

### Record Key Syntax
Regardless of the type, Record Keys must fulfill some baseline syntax constraints:

- restricted to a subset of ASCII characters — the allowed characters are alphanumeric (`A-Za-z0-9`), period, dash, underscore, colon, or tilde (`.-_:~`)
- must have at least 1 and at most 512 characters
- the specific record key values `.` and `..` are not allowed
- must be a permissible part of repository MST path string (the above constraints satisfy this condition)
- must be permissible to include in a path component of a URI (following RFC-3986, section 3.3). The above constraints satisfy this condition, by matching the "unreserved" characters allowed in generic URI paths.

Record Keys are case-sensitive.

### Examples
Valid Record Keys:

```lua
3jui7kd54zh2y
self
example.com
~1.2-3_
dHJ1ZQ
pre:fix
_
```

Invalid Record Keys:

```python
alpha/beta
.
..
#extra
@handle
any space
any+space
number[3]
number(3)
"quote"
dHJ1ZQ==
```
