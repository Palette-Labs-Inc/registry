# RFC: Lexicons, a network specific Schema Definition Language

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
The protocol will define data types and messages that can be universally referenced within the network. This document proposes the adoption of a schema definition language called "Lexicon" to define data schemas that represent objects related to events in the lifecycle of a commercial transaction, or otherwise the entities that are engaged in the transaction. Lexicon is similar to an [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) specification with added semantic nice-to-haves that are useful for our architecture.

## Introduction
Lexicon is used to define RPC methods and record types. Lexicons give developers a uniform method and process to write and define new data structures for the network. Schemas are defined using `NSID`s. `NSID`s support a network wide domain categorization of methods and [Data Models](./00004-data-models.md).

## Motivation
Our motivation for a schema definition language is largely the same as the [raw IPLD Schema motivation](https://ipld.io/docs/schemas/#motivation). A standard for the networks data will make coordinating groups of developers and their applications much easier. IPLD Schemas have rich support for describing immutable document graphs based on [content-addressable](https://ipld.io/glossary/#content-addressing) [linking](https://ipld.io/glossary/#link) in distributed systems.  

An open network like nosh needs a way to agree on data structures, transport, and semantics. Lexicon solves this problem by giving a uniform schema definition language. This primitive allows new markets to permissionlessly emerge. 

For example, the company will initially define the basic data models and API definitions for food-delivery, rideshare, and other e-commerce networks but it is unliekly that we will be able to create the schemas for all categories of commercial applications. In order for the network to grow into many new categories independently, we need a common way for developers to describe data. Further, this schema language enables code-generation with types and validation which makes life very easy for developers. 

We considered adopting [RDF standards](https://www.w3.org/RDF/) but the generality and lack of strictness felt uncomfortable here. RDF is good for generic or easily generalizable use cases but this felt wrong for the highly contractually commercial setting in which applications building here require. We wanted a more strict schema language that was easy for developers to use and offer assurances for strongly typed APIs with runtime correctness validations against over HTTP. 

## Examples

**example namespace methods**:
```ts
nosh.bsn.buyer.updateAddress()
nosh.psn.provider.getCatalog()
```

**example record types**:
 ```ts
nosh.bsn.buyer.address
nosh.psn.provider.catalog
```

**example api call**:
```ts
await nosh.server.buyer.updatePreferences({
  user: 'alice',
})
```
In the above API call, Lexicon establishes a shared method id (`nosh.bsn.buyer.updateAddress`) and the expected query params, input body, and output body. By using Lexicon the call inherits runtime checks on the inputs, outputs, and contexts of all calls which is vital in distributed systems.

## Proposal
Here, we introduce "Lexicon", a schema [interface definition language](https://en.wikipedia.org/wiki/Interface_description_language) used to describe records, HTTP endpoints, and event stream messages (websockets). This RFC builds on top of the [Data Models](./00004-data-models.md) RFC.

### Overview of Types
| Lexicon Type | Data Model Type | Category   |
|--------------|-----------------|------------|
| `null`       | Null            | concrete   |
| `boolean`    | Boolean         | concrete   |
| `integer`    | Integer         | concrete   |
| `string`     | String          | concrete   |
| `bytes`      | Bytes           | concrete   |
| `cid-link`   | Link            | concrete   |
| `blob`       | Blob            | concrete   |
| `array`      | Array           | container  |
| `object`     | Object          | container  |
| `params`     |                 | container  |
| `token`      |                 | meta       |
| `ref`        |                 | meta       |
| `union`      |                 | meta       |
| `unknown`    |                 | meta       |
| `record`     |                 | primary    |
| `query`      |                 | primary    |
| `procedure`  |                 | primary    |
| `context`    |                 | primary    |
| `subscription`|                | primary    |


### Lexicon Files
Lexicons are JSON files associated with a single `NSID`. A file contains one or more definitions, each with a distinct short name. A definition with the name `main` optionally describes the "primary" definition for the entire file. A Lexicon with zero definitions is invalid.

A Lexicon JSON file is an object, similar to a `.yaml` or `.json` file in [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification). Each Lexicon JSON file defines a specific piece of information or communication method for the network. Lexicon JSON files universally define client-to-server interactions and server-to-server interactions in the network.

- `lexicon` (integer, required): indicates Lexicon language version. In this version, a fixed value of `1` is used
- `id` (string, required): the `NSID` of the Lexicon
- `revision` (integer, optional): indicates the version of this Lexicon, if changes have occurred
- `description` (string, optional): a description of the Lexicon, usually one or two sentences useful for developers to understand
- `defs` (map of strings-to-objects, required): set of definitions, each with a distinct name (key)

Schema definitions under `defs` all have a `type` field to distinguish their type. A file can have at most one definition with one of the "primary" types. Primary types should always have the name `main`. It is possible for `main` to describe a non-primary type.

References to specific definitions within a Lexicon use fragment syntax, like `com.example.defs#someView`. If a `main` definition exists, it can be referenced without a fragment, just using the `NSID`. For references in the `$type` fields in data objects themselves (eg, records or contents of a union), this is a "must" (use of a `#main` suffix is invalid). For example, `com.example.record` not `com.example.record#main`.

The semantics of the `revision` field have not been worked out yet, but are intended to help third parties identify the most recent among multiple versions or copies of a Lexicon.

Related Lexicons are often grouped together in a `NSID` hierarchy, for example a `Buyer` entity might have it's own namespace to group data models under a single `Buyer` domain. As a convention, any definitions used by multiple Lexicons are defined in a dedicated `*.defs` Lexicon (eg, `com.atproto.server.defs`) within the group. A `*.defs` Lexicon should generally not include a definition named `main`, though it is not strictly invalid to do so.

## Primary Type Definitions
The primary types are:
- `query`: describes an XRPC Query (HTTP GET)
- `procedure`: describes an XRPC Procedure (HTTP POST)
- `subscription`: Event Stream (WebSocket)
- `context`: describe a cryptographically signed binary data object used to validate the integrity of a record and it's creator (signer)
- `record`: describes an object that can be stored in a repository record
 
Each primary definition schema object includes these fields:
- `type` (string, required): the type value (eg, `record` for records)
- `description` (string, optional): short, usually only a sentence or two

### Record
Type-specific fields:
- `key` (string, required): specifies the [Record Key type](./00006-record-keys.md)
- `record` (object, required): a schema definition with type `object`, which specifies this type of record

### Query, Procedure, and Context
Type-specific fields:
- `parameters` (object, optional): a schema definition with type `params`, describing the HTTP query parameters for this endpoint
- `output` (object, optional): describes the HTTP response body
    - `description` (string, optional): short description
    - `encoding` (string, required): MIME type for body contents. Must use `application/json` for JSON responses.
    - `schema` (object, optional): schema definition, either an `object`, a `ref`, or a `union` of refs. Used to describe JSON encoded responses, though schema is optional even for JSON responses.
- `input` (object, optional, only for `procedure`): describes HTTP request body schema, with the same format as the `output` field
- `errors` (array of objects, optional): set of string error codes which might be returned
    - `name` (string, required): short name for the error type, with no whitespace
    - `description` (string, optional): short description, one or two sentences

### Subscription (Event Stream)
Type-specific fields:
- `parameters` (object, optional): same as Query and Procedure
- `message` (object, optional): specifies what messages can be
    - `description` (string, optional): short description
    - `schema` (object, required): schema definition, which must be a `union` of refs
- `errors` (array of objects, optional): same as Query and Procedure

Subscription schemas (referenced by the `schema` field under `message`) must be a `union` of refs, not an `object` type.

## Field Type Definitions
Every schema object includes these fields:

- `type` (string, required): fixed value for each type
- `description` (string, optional): short, usually only a sentence or two

### `null`
No additional fields.

### `boolean`
Type-specific fields:

- `default` (boolean, optional): a default value for this field
- `const` (boolean, optional): a fixed (constant) value for this field

When included as an HTTP query parameter, should be rendered as `true` or `false` (no quotes).

### `integer`
A signed integer number.

Type-specific fields:
- `minimum` (integer, optional): minimum acceptable value
- `maximum` (integer, optional): maximum acceptable value
- `enum` (array of integers, optional): a closed set of allowed values
- `default` (integer, optional): a default value for this field
- `const` (integer, optional): a fixed (constant) value for this field

### `string`
Type-specific fields:

- `format` (string, optional): string format restriction
- `maxLength` (integer, optional): maximum length of value, in UTF-8 bytes
- `minLength` (integer, optional): minimum length of value, in UTF-8 bytes
- `maxGraphemes` (integer, optional): maximum length of value, counted as Unicode Grapheme Clusters
- `minGraphemes` (integer, optional): minimum length of value, counted as Unicode Grapheme Clusters
- `knownValues` (array of strings), options: a set of suggested or common values for this field. Values are not limited to this set (aka, not a closed enum).
- `enum` (array of strings, optional): a closed set of allowed values
- `default` (string, optional): a default value for this field
- `const` (string, optional): a fixed (constant) value for this field

Strings are Unicode. For non-Unicode encodings, use `bytes` instead. The basic `minLength`/`maxLength` validation constraints are counted as UTF-8 bytes. Note that Javascript stores strings with UTF-16 by default, and it is necessary to re-encode to count accurately. The `minGraphemes`/`maxGraphemes` validation constraints work with Grapheme Clusters, which have a complex technical and linguistic definition, but loosely correspond to "distinct visual characters" like Latin letters, CJK characters, punctuation, digits, or emoji (which might comprise multiple Unicode codepoints and many UTF-8 bytes).

`format` constrains the string format and provides additional semantic context. Refer to the Data Model specification for the available format types and their definitions.

`const` and `default` are mutually exclusive.

### `bytes`
Type-specific fields:

- `minLength` (integer, optional): minimum size of value, as raw bytes with no encoding
- `maxLength` (integer, optional): maximum size of value, as raw bytes with no encoding

### `cid-link`
No type-specific fields.

See [Data Model spec](https://atproto.com/specs/data-model) for CID restrictions.

### `array`
Type-specific fields:

- `items` (object, required): describes the schema elements of this array
- `minLength` (integer, optional): minimum count of elements in array
- `maxLength` (integer, optional): maximum count of elements in array

In theory arrays have homogeneous types (meaning every element as the same type). However, with union types this restriction is meaningless, so implementations can not assume that all the elements have the same type.

### `object`
A generic object schema which can be nested i`NSID`e other definitions by reference.

Type-specific fields:

- `properties` (map of strings-to-objects, required): defines the properties (fields) by name, each with their own schema
- `required` (array of strings, optional): indicates which properties are required
- `nullable` (array of strings, optional): indicates which properties can have `null` as a value

As described in the data model specification, there is a semantic difference in data between omitting a field; including the field with the value `null`; and including the field with a "false-y" value (`false`, `0`, empty array, etc).

### `blob`
Type-specific fields:

- `accept` (array of strings, optional): list of acceptable MIME types. Each may end in `*` as a glob pattern (eg, `image/*`). Use `*/*` to indicate that any MIME type is accepted.
- `maxSize` (integer, optional): maximum size in bytes

### `params`
This is a limited-scope type which is only ever used for the `parameters` field on `query`, `procedue`, and `subscription` primary types. These map to HTTP query parameters.

Type-specific fields:

- `required` (array of strings, optional): same semantics as field on `object`
- `properties`: similar to properties under `object`, but can only include the types `boolean`, `integer`, `string`, and `unknown`; or an `array` of one of these types

Note that unlike `object`, there is no `nullable` field on `params`.

### `token`
Tokens are empty data values which exist only to be referenced by name. They are used to define a set of values with specific meanings. The `description` field should clarify the meaning of the token.

Tokens are similar to the concept of a "symbol" in some programming languages, distinct from strings, variables, built-in keywords, or other identifiers.

For example, tokens could be defined to represent the state of an entity (in a state machine), or to enumerate a list of categories.

No type-specific fields.

### `ref`
Type-specific fields:

- `ref` (string, required): reference to another schema definition

Refs are a mechanism for re-using a schema definition in multiple places. The `ref` string can be a global reference to a Lexicon type definition (an `NSID`, optionally with a `#`-delimited name indicating a definition other than `main`), or can indicate a local definition within the same Lexicon file (a `#` followed by a name).

### `union`
Type-specific fields:

- `refs` (array of strings, required): references to schema definitions
- `closed` (boolean, optional): indicates if a union is "open" or "closed". defaults to `false` (open union)

Unions represent that multiple possible types could be present at this location in the schema. The references follow the same syntax as `ref`, allowing references to both global or local schema definitions. Actual data will validate against a single specific type: the union does not _combine_ fields from multiple schemas, or define a new _hybrid_ data type. The different types are referred to as **variants**.

By default unions are "open", meaning that future revisions of the schema could add more types to the list of refs (though can not remove types). This means that implementations should be permissive when validating, in case they do not have the most recent version of the Lexicon. The `closed` flag (boolean) can indicate that the set of types is fixed and can not be extended in the future.

A `union` schema definition with no `refs` is allowed and similar to `unknown`, as long as the `closed` flag is false (the default). An empty refs list with `closed` set to true is an invalid schema.

The schema definitions pointed to by a `union` are generally objects or types with a clear mapping to an object, like a `record`. All the variants must be represented by a CBOR map (or JSON Object) and include a `$type` field indicating the variant type.

### `unknown`
Indicates than any data could appear at this location, with no specific validation. Note that the data must still be valid under the data model: it can't contain unsupported things like floats.

No type-specific fields.

## String Formats
Strings can optionally be constrained to one of the following `format` types:

- `at-identifier`: either a [Handle](https://atproto.com/specs/handle) or a [DID](https://atproto.com/specs/did), details described below
- `at-uri`: [AT-URI](https://atproto.com/specs/at-uri-scheme)
- `cid`: CID in string format, details specified in [Data Model](https://atproto.com/specs/data-model)
- `datetime`: timestamp, details specified below
- `did`: generic [DID Identifier](https://atproto.com/specs/did)
- `handle`: [Handle Identifier](https://atproto.com/specs/handle)
- ``NSID``: [Namespaced Identifier](https://atproto.com/specs/`NSID`)
- `uri`: generic URI, details specified below
- `language`: language code, details specified below

For the various identifier formats, when doing Lexicon schema validation the most expansive identifier syntax format should be permitted. Problems with identifiers which do pass basic syntax validation should be reported as application errors, not lexicon data validation errors. For example, data with any kind of DID in a `did` format string field should pass Lexicon validation, with unsupported DID methods being raised separately as an application error.

### `at-identifier`
A string type which is either a DID (type: did) or a handle (handle). Mostly used in XRPC query parameters. It is unambiguous whether an at-identifier is a handle or a DID because a DID always starts with did:, and the colon character (:) is not an allowed in handles.

### `datetime`
Full-precision date and time, with timezone information.

This format is intended for use with computer-generated timestamps in the modern computing era (eg, after the UNIX epoch). If you need to represent historical or ancient events, ambiguity, or far-future times, a different format is probably more appropriate. Datetimes before the Current Era (year zero) as specifically disallowed.

Datetime format standards are notoriously flexible and overlapping. Datetime strings in atproto should meet the [intersecting](https://ijmacd.github.io/rfc3339-iso8601/) requirements of the [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339), [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), and [WHATWG HTML](https://html.spec.whatwg.org/#dates-and-times) datetime standards.

The character separating "date" and "time" parts must be an upper-case `T`.

Timezone specification is required. It is _strongly_ preferred to use the UTC timezone, and to represent the timezone with a simple capital `Z` suffix (lower-case is not allowed). While hour/minute suffix syntax (like `+01:00` or `-10:30`) is supported, "negative zero" (`-00:00`) is specifically disallowed (by ISO 8601).

Whole seconds precision is required, and arbitrary fractional precision digits are allowed. Best practice is to use at least millisecond precision, and to pad with zeros to the generated precision (eg, trailing `:12.340Z` instead of `:12.34Z`). Not all datetime formatting libraries support trailing zero formatting. Both millisecond and microsecond precision have reasonable cross-language support; nanosecond precision does not.

Implementations should be aware when round-tripping records containing datetimes of two ambiguities: loss-of-precision, and ambiguity with trailing fractional second zeros. If de-serializing Lexicon records in to native types, and then re-serializing, the string representation may not be the same, which could result in broken hash references, sanity check failures, or repository update churn. A safer thing to do is to deserialize the datetime as a simple string, which ensures round-trip re-serialization.

Implementations "should" validate that the semantics of the datetime are valid. For example, a month or day `00` is invalid.

Valid examples:

```shell
# preferred
1985-04-12T23:20:50.123Z
1985-04-12T23:20:50.123456Z
1985-04-12T23:20:50.120Z
1985-04-12T23:20:50.120000Z

# supported
1985-04-12T23:20:50.12345678912345Z
1985-04-12T23:20:50Z
1985-04-12T23:20:50.0Z
1985-04-12T23:20:50.123+00:00
1985-04-12T23:20:50.123-07:00
```

Invalid examples:

```shell
1985-04-12
1985-04-12T23:20Z
1985-04-12T23:20:5Z
1985-04-12T23:20:50.123
+001985-04-12T23:20:50.123Z
23:20:50.123Z
-1985-04-12T23:20:50.123Z
1985-4-12T23:20:50.123Z
01985-04-12T23:20:50.123Z
1985-04-12T23:20:50.123+00
1985-04-12T23:20:50.123+0000

# ISO-8601 strict capitalization
1985-04-12t23:20:50.123Z
1985-04-12T23:20:50.123z

# RFC-3339, but not ISO-8601
1985-04-12T23:20:50.123-00:00
1985-04-12 23:20:50.123Z

# timezone is required
1985-04-12T23:20:50.123

# syntax looks ok, but datetime is not valid
1985-04-12T23:99:50.123Z
1985-00-12T23:20:50.123Z
```

### `uri`
Flexible to any URI schema, following the generic RFC-3986 on URIs. This includes, but isn’t limited to: `did`, `https`, `wss`, `ipfs` (for CIDs), `dns`, and of course `at`. Maximum length in Lexicons is 8 KBytes.

### `language`
A string formatted as an [IETF Language Tag](https://en.wikipedia.org/wiki/IETF_language_tag), adhering to the [BCP 47](https://www.rfc-editor.org/info/bcp47) standard as outlined in [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt) ("Tags for Identifying Languages"). This standard is utilized across various web technologies, including HTTP and HTML, for language identification. The string must be a "well-formed" language tag per the RFC's definition. "Well-formed" tags that are not "valid" per the RFC should be disregarded by clients.

Language tags can incorporate ISO 639 codes in two or three characters, presented in lowercase (e.g., `ja` for Japanese, `ban` for Balinese), possibly extended with regional sub-tags (e.g., `pt-BR` for Brazilian Portuguese) and additional subtags (e.g., `hy-Latn-IT-arevela`).

These language codes are intended for semantic parsing, normalization, and matching rather than simple string comparison. For instance, a search engine might reduce language tags to their ISO 639 codes for the purposes of indexing and filtering, whereas a client application may utilize the complete language code for local text rendering.

#### Examples
- `en` for English
- `fr-CA` for Canadian French
- `zh-Hant` for Traditional Chinese

### `currency`
A currency code in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) format. This format is used internationally to define the codes of currencies. For example, the currency code for US dollars is `USD`. The value should be a three-letter uppercase string that adheres to the ISO 4217 standard.

#### Examples
- `USD` for US Dollar
- `EUR` for Euro
- `JPY` for Japanese Yen

### `country`
A country code, in the two-letter format of [ISO 3166](https://www.iso.org/iso-3166-country-codes.html). These codes are internationally recognized codes assigned to each country and certain territories. They are two-letter codes written in uppercase. This is often used for setting locales, addressing, and other internationalization functions.

#### Examples
- `US` for United States
- `JP` for Japan
- `GB` for United Kingdom

### `H3Array`
An array of H3 geospatial indices. The H3 system is a framework for geospatial indexing that divides the world into a hexagonal grid. Each cell in the grid is identified by a unique index, represented as a 15-character hexadecimal string. This array can be used for various applications, including mapping, spatial analysis, and geospatial data management.

#### Properties
- **Type**: `array`
- **Items Type**: `string`
- **Items Description**: An H3 index represented as a 15-character hexadecimal string. Each index corresponds to a specific hexagon in the global grid.

#### Example
```json
[   "8f2830828052d25",   "8f283082a30e623",   "8f283082a6edfff" ]
```

This JSON snippet represents an array of H3 indices, each pointing to a specific hexagonal cell.

## When to use `$type`
Data objects sometimes include a `$type` field which indicates their Lexicon type. The general principle is that this field needs to be included any time there could be ambiguity about the content type when validating data.

The specific rules are:

- `record` objects must always include `$type`. While the type is often known from context (eg, the collection part of the path for records stored in a repository), record objects can also be passed around outside of repositories and need to be self-describing
- `union` variants must always include `$type`, except at the top level of `subscription` messages

Note that `blob` objects always include `$type`, which allows generic processing.

As a reminder, `main` types must be referenced in `$type` fields as just the `NSID`, not including a `#main` suffix.

## References
- [Bsky](https://atproto.com/guides/lexicon)

