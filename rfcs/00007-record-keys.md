# RFC: Record Keys

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
A **Record Key** (sometimes shortened to `rkey`) is used to name and reference an individual `record` within a shared "collection" of a [Data Repository](./00006-data-repositories.md).

## Motivation
To provide a record identification system for data retrieval and search in [Data Repository](./00006-data-repositories.md).

## Proposal
Support for [Record Key](./00007-record-keys.md#record-key-syntax) naming schemes. Every record [NSDL](./00009-namespace-identifiers.md) schema will indicate which of the record key types should be used, depending on the needs of the record collection.

### Record Key Type: `tid`
`TID` is short for "timestamp identifier" and represents a `createdAt` timestamp for a record in an MST.

**The characteristics of a `TID` are:**
- 64-bit integer
- big-endian byte ordering
- encoded as `base32-sortable`. That is, encoded with characters `234567abcdefghijklmnopqrstuvwxyz`, with no padding, yielding 13 ASCII characters.
- hyphens should not be included in a `TID` 

**The layout of the 64-bit int:**
- The top bit is always 0
- The next 53 bits represent microseconds since the UNIX epoch. 53 bits is chosen as the maximum safe integer precision in a 64-bit floating point number
- The final 10 bits are a random "clock identifier" (TODO, explain)

The primary motivation for the `TID` is to provide a temporal ordering of records.

### Record Key Type: `literal:<value>`
Used when there is a requirement for a single record to exist within the collection. The most common value is `self`, specified as `literal:self` in a NSDL schema.

### Record Key Type: `any`
Any string that conforms to the general Record Key schema criteria below. This is the most versatile format of a `Record Key`.

### Record Key schema Requirements
Record Keys must adhere to the following syntactic rules:
- Limited to a subset of ASCII characters, which include alphanumerics (`A-Za-z0-9`), the period, the dash, the underscore, the colon, or the tilde (`.-_:~`)
- Must consist of a minimum of 1 and a maximum of 512 characters
- *key* values `.` and `..` are disallowed
- Must be compatible as a part of a repository MST path string, satisfying the given constraints
- Must be permissible for inclusion in a path component of a URI, aligning with [RFC-3986, section 3.3](https://datatracker.ietf.org/doc/html/rfc3986#section-3.3).

Record Keys are case-sensitive.

### Examples
**Valid Record Keys:**
- `1a2b3c`
- `self`
- `example.net`
- `~1.2-3_`
- `rDg8fH`
- `prefix:suffix`
- `_`

**Invalid Record Keys:**
- `alpha/beta` - Contains disallowed character `/`
- `.` - Disallowed key value
- `..` - Disallowed key value
- `#extra` - Contains disallowed character `#`
- `any space` - Contains disallowed character ` ` (space)
- `any+space` - Contains disallowed character `+`
- `number[3]` - Contains disallowed characters `[` and `]`
- `number(3)` - Contains disallowed characters `(` and `)`
- `"quote"` - Contains disallowed character `"`
- `dHJ1ZQ==` - Invalid base32 encoding (contains padding characters)

## References
- [RFC-3986, section 3.3](https://datatracker.ietf.org/doc/html/rfc3986#section-3.3).