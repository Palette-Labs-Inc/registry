# RFC: NSDL, a Nosh Protocol specific Schema Definition Language

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
The protocol will define data types and messages that can be universally referenced within the network. This document proposes the adoption of a schema definition language called the "Nosh Schema Defintion Language (NSDL)" to define data schemas that represent objects related to events in the lifecycle of a commercial transaction. NSDL is similar to an [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) specification with added semantic nice-to-haves that are useful for our architecture.

## Introduction
The NSDL is used for the definition of RPC methods and record types, providing developers with a standardized approach and workflow for crafting and specifying new data structures within the network. Schemas are defined using RDSIDs. RDSIDs facilitate a network-wide domain categorization of methods and [Data Models](./00004-data-models.md).

## Motivation
Our motivation for a schema definition language is largely the same as the [raw IPLD Schema motivation](https://ipld.io/docs/schemas/#motivation). A standard for the networks data will make coordinating groups of developers and their applications much easier. IPLD Schemas have rich support for describing immutable document graphs based on [content-addressable](https://ipld.io/glossary/#content-addressing) [linking](https://ipld.io/glossary/#link) in distributed systems.  

An open network like nosh needs a way to agree on data structures, transport, and semantics. Lexicon solves this problem by giving a uniform schema definition language. This primitive allows new markets to permissionlessly emerge. 

For example, the company will initially define the basic data models and API definitions for food-delivery, rideshare, and other e-commerce networks but it is unliekly that we will be able to create the schemas for all categories of commercial applications. In order for the network to grow into many new categories independently, we need a common way for developers to describe data. Further, this schema language enables code-generation with types and validation which makes life very easy for developers. 

We considered adopting [RDF standards](https://www.w3.org/RDF/) but the generality and lack of strictness felt uncomfortable here. RDF is good for generic or easily generalizable use cases but this felt wrong for the highly contractually commercial setting in which applications building here require. We wanted a more strict schema language that was easy for developers to use and offer assurances for strongly typed APIs with runtime correctness validations against over HTTP. 

## Examples

**example namespace methods**:
```ts
xyz.nosh.buyer.updateAddress()
xyz.nosh.provider.getCatalog()
```

**example record types**:
 ```ts
xyz.nosh.buyer.address
xyz.nosh.provider.catalog
```

**example api call**:
```ts
await nosh.server.buyer.updatePreferences({
  user: 'alice',
})
```
In the above API call, NSDL establishes a shared method id (`xyz.nosh.buyer.updateAddress`) and the expected query params, input body, and output body. By using NSDL, the call inherits runtime checks on the inputs, outputs, and contexts of all calls which is vital in distributed systems.

## Proposal
Below you can see an overview of types. This RFC builds on top of the [Data Models](./00004-data-models.md) RFC.

### Overview of Types
| NSDL Type    | Data Model Type | Category   |
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


### NSDL Files (Schema Definition Documents)
NSDL files are JSON documents associated with a single `RDSID`. Each file includes one or more definitions, each marked by a unique short name. A definition named `main` may optionally signify the "primary" definition for the entire document. An NSDL file lacking definitions is considered invalid.

An NSDL JSON file is an object, akin to a `.yaml` or `.json` file in [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification). Each NSDL JSON file delineates a specific piece of information or communication method for the network. NSDL JSON files uniformly define client-to-server and server-to-server interactions within the network.

- `nsdl` (integer, required): indicates the NSDL language version. In this version, a fixed value of `1` is used.
- `id` (string, required): the `RDSID` of the NSDL document.
- `revision` (integer, optional): indicates the version of this NSDL document, if changes have occurred.
- `description` (string, optional): a description of the NSDL document, usually one or two sentences useful for developers to understand.
- `defs` (map of strings-to-objects, required): set of definitions, each with a distinct name (key).

Schema definitions under `defs` all have a `type` field to distinguish their type. A file can have at most one definition with one of the "primary" types. Primary types should always have the name `main`. It is possible for `main` to describe a non-primary type.

References to specific definitions within an NSDL document use fragment syntax, like `com.referenceDomain.defs#someView`. If a `main` definition exists, it can be referenced without a fragment, just using the `RDSID`. For references in the `$type` fields in data objects themselves (e.g., records or contents of a union), this is a "must" (use of a `#main` suffix is invalid). For example, `com.referenceDomain.record` not `com.referenceDomain.record#main`.

Related NSDL documents are often grouped together under a `RDSID` hierarchy, for example, a `Buyer` entity might have its own namespace to group data models under a single `Buyer` domain. As a convention, any definitions used by multiple NSDL documents are defined in a dedicated `*.defs` NSDL document (e.g., `com.referenceDomain.psn.defs`) within the group. A `*.defs` NSDL document should generally not include a definition named `main`, though it is not strictly invalid to do so.

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

### Subscription (Events)
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
- `const` (boolean, optional): a constant value for this field

When included as an HTTP query parameter, should be rendered as `true` or `false` (raw text with no quotes).

### `integer`
A signed positive (+) or negative (-) integer number.
Type-specific fields:
- `format` (integer, optional): integer format restriction
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

Strings must be in Unicode. If using non-Unicode encodings, switch to bytes. The minLength and maxLength constraints are measured in UTF-8 bytes, but remember, JavaScript defaults to UTF-16 for strings, so conversion for accurate counts is necessary. The minGraphemes and maxGraphemes constraints are based on Grapheme Clusters, essentially "visual characters" such as emojis, which may encompass multiple Unicode codepoints and a larger number of UTF-8 bytes.

`format` constrains the string format for further validation assurances. Refer to the [Data Model](./00004-data-models.md) specification for the available format types and their definitions.

`default` and `const` are mutually exclusive, and therefore invalidated if both are provided.

### `bytes`
Type-specific fields:
- `minLength` (integer, optional): minimum size of value, as raw bytes with no encoding
- `maxLength` (integer, optional): maximum size of value, as raw bytes with no encoding

### `cid-link`
No type-specific fields. See [Data Model spec](./00004-data-models.md) for CID restrictions.

### `array`
Type-specific fields:
- `items` (object, required): describes the schema elements of this array
- `minLength` (integer, optional): minimum count of elements in array
- `maxLength` (integer, optional): maximum count of elements in array

Although arrays are usually homogeneous (all elements share the same type), the introduction of union types renders this constraint obsolete. Becayse if unions, implementations *should not* to presume uniformity in element types within an array.

### `object`
A generic object schema
Type-specific fields:
- `properties` (map of strings-to-objects, required): defines the properties (fields) by name, each with their own schema
- `required` (array of strings, optional): indicates which properties are required
- `nullable` (array of strings, optional): indicates which properties can have `null` as a value

Following the [data model](./00004-data-models.md) guidelines, there's a crucial distinction in how data is interpreted based on whether a field is omitted, included with a `null` value, or included with a "false-y" value (such as `false`, `0`, or an empty array).

### `blob`
Type-specific fields:
- `accept` (array of strings, optional): Specifies a list of acceptable MIME types. Entries can utilize `*` as a wildcard, allowing glob patterns like `image/*`. To accept any MIME type, use `*/*`.
- `maxSize` (integer, optional): Defines the maximum allowable size in bytes for the blob.

### `params`
This type is specifically designed for use with the `parameters` field found in the primary types `query`, `procedure`, and `subscription`. It corresponds to HTTP query parameters, indicating a narrow scope.

Type-specific fields:
- `required` (array of strings, optional): same semantics as field on `object`
- `properties`: similar to properties under `object`, but can only include the types `boolean`, `integer`, `string`, and `unknown`; or an `array` of one of these types

in contrast to the `object` type, the `params` type does not include a `nullable` field. This distinction underscores a specific design choice in how `params` handles the presence or absence of values differently from `object`.

### `token`
Tokens are like the "symbol" in certain programming languages, serving as unique identifiers separate from strings, variables, keywords, or any other form of identification. They're used for representing discrete values like in a state machine or enumerated a set of categories.

### `ref`
Type-specific fields:

- `ref` (string, required): reference to another schema definition

Refs serve as a method for re-utilizing a schema definition. The `ref` string may either point to a global reference of an NSDL type definition, an `RDSID` which might include a `#`-delimited name to specify a definition distinct from `main`, or it can refer to a local definition within the same NSDL document. This local reference is indicated by a `#` followed by the name, enabling the reuse of definitions either globally across different files or locally within the same document.

### `union`
Type-specific fields:
- `refs` (array of strings, required): references to schema definitions
- `closed` (boolean, optional): indicates if a union is "open" or "closed". defaults to `false` (open union)

Unions in a schema signify the presence of multiple possible types at a specific location, functioning similarly to polymorphic types. These unions utilize the `ref` syntax for referencing, allowing them to point to either global or local schema definitions. A union does not amalgamate fields from different schemas into one or create a new "hybrid" type. Instead, the actual data must match one specific type within the union, which are referred to as **variants**.

Unions are typically `open`. *Openness* allows for the possibility of adding more types to the list of refs. This design choice suggests that implementations should *validate data leniently* to accommodate potential updates they haven't yet received. 

A `closed` boolean flag exists to signify that a union's set of types is permanently fixed, preventing any future amendments.

A unique aspect of unions is the allowance of a schema definition without any `refs`, akin to an `unknown` type, provided the `closed` flag is unset (false by default). Conversely, a union marked as `closed` without any `refs` constitutes an invalid schema, highlighting the necessity for at least one potential type in a closed union.

For the types within a `union`, they are typically structured as objects or types easily translated into objects, like a `record`. Each variant within the union is expected to be represented by a CBOR map (or JSON Object) and must include a `$type` field to denote the specific variant type. 

### `unknown`
Any type of data is permitted to appear at the designated location without undergoing type-specific validation. It's crucial to note that while this offers flexibility, the data *must still conform* to the overarching [data model requirements](./00004-data-models.md). This implies that the data cannot include elements unsupported by the model, such as Floats.

## String Formats
Strings can optionally be constrained to one of the following `format` types:
- `nosh-uri`: [NOSH-URI](./00008-uri-standards.md#full-nosh-uri-syntax)
- `cid`: CID in string format, details specified in [Data Model](./00004-data-models.md)
- `datetime`: timestamp, details specified below
- `rdsid`: a [reverse domain schema identifier](./00009-namespace-identifiers.md)
- `uri`: generic URI, details specified below
- `language`: language code, details specified below
- `currency`: currency code, details specified below
- `country`: country code, details specified below
- `eth`: the `custody address` for an `account identifier`
- `h3`: a string of hexidecimal characters representing a [geospatial index](https://github.com/uber/h3)

### `datetime`
Full-precision date and time, with timezone information.

This format is specifically intended for use with computer-generated timestamps after the UNIX epoch. Datetimes before year zero or in distant future times are disallowed and you should opt for a different format.

Datetime format standards vary widely and often overlap. Datetime strings are expected to conform to the intersecting requirements of [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339), [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), and [WHATWG HTML](https://html.spec.whatwg.org/#dates-and-times) datetime standards.

The character separating "date" and "time" parts must be an upper-case `T`.

Timezone specification is mandatory. It is highly recommended to use the UTC timezone and represent it with a capital `Z` suffix. The use of lowercase `z` is not allowed. While the hour/minute suffix syntax (e.g., `+01:00` or `-10:30`) is supported, "negative zero" (`-00:00`) is disallowed according to [ISO 8601](https://www.w3.org/TR/NOTE-datetime).

Whole seconds precision is mandatory, with the allowance for arbitrary fractional precision digits. It's recommended to adhere to at least millisecond precision and fill with zeros to match the generated precision. For instance, use trailing `:12.340Z` instead of `:12.34Z`. 

Implementations "should" ensure that the semantics of the datetime are valid. For instance, dates with a month or day set to 00 should be considered invalid.

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

### `rdsid`
Represents a syntactically valid [Reverse Domain Schema Identifier](./00009-namespace-identifiers.md)

#### Examples:
- `nosh.example.fooBar`
- `users.alice.hello`
- `a-0.b-1.f`
- `x.y.z`
- `xn.2.test.thing`

### `uri`
Flexible to any URI schema, following the generic RFC-3986 on URIs. This includes, but isn’t limited to: `https`, `wss`, `ipfs` (for CIDs), `dns`, and [`nosh`](./00008-uri-standards.md). Maximum length in Lexicons is 8 KBytes.

### `language`
A string formatted as an [IETF Language Tag](https://en.wikipedia.org/wiki/IETF_language_tag) should adhere to the [BCP 47](https://www.rfc-editor.org/info/bcp47) standard outlined in [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt). This standard is widely used in web technologies like HTTP and HTML for language identification. The string must be a "well-formed" language tag as defined by the RFC. Clients should disregard "well-formed" tags that are not considered "valid" according to the RFC's specifications.

Language tags can include ISO 639 code. These codes may be extended with regional sub-tags (e.g., `pt-BR` for Brazilian Portuguese) and additional subtags (e.g., `hy-Latn-IT-arevela`).

#### Examples
- `en` for English
- `fr-CA` for Canadian French
- `zh-Hant` for Traditional Chinese

### `currency`
A currency code in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) format. This format is used internationally to define the codes of currencies. The value should be a three-letter uppercase string that adheres to the ISO 4217 standard.

#### Examples
The US dollar is represented as `USD` – the US coming from the ISO 3166 country code and the D for dollar.
The Swiss franc is represented by `CHF` – the CH being the code for Switzerland in the ISO 3166 code and F for franc.

### `country`
A country code, in the two-letter format of [ISO 3166](https://www.iso.org/iso-3166-country-codes.html). These codes are internationally recognized codes assigned to each country and certain territories. They are two-letter codes written in uppercase. This is often used for setting locales, addressing, and other internationalization functions.

#### Examples
- `US` for United States
- `JP` for Japan
- `GB` for United Kingdom

### `eth`
An `custody address` representing the `custody address` or `recovery address` of a registered account in the nosh-protocol network.

#### Example
- `0xb794f5ea0ba39494ce839613fffba74279579268` - represents a hexagonal representation of a physical global position

### `h3`
An array of H3 geospatial indices. The H3 system is a framework for geospatial indexing that divides the world into a hexagonal grid. Each cell in the grid is identified by a unique index, represented as a 15-character hexadecimal string. This array can be used for various applications, including mapping, spatial analysis, and geospatial data management.

#### Example
- `8f2830828052d25` - represents a hexagonal representation of a physical global position

## Integer Formats
Integers can be constrained to the following `format` type:
- `aid`: generic [Account Identifier](./00003-identity-contracts.md#account-identifiers)

### `aid`
A shorthand format for an [`Account Identifier`](./00003-identity-contracts.md#account-identifiers)

#### Examples
- `198663` an integer nonce representing registered account 198663 in the [`Identity Contracts`](./00003-identity-contracts.md)

## When to use `$type`
In data objects, the `$type` field indicates their Lexicon type. This field is necessary whenever there could be ambiguity about the content type during data validation.

The rules regarding the `$type` field are as follows:

- `record` objects must always include `$type`. Even though the type is often inferred from context (such as the collection part of the path for records stored in a repository), record objects may be passed around outside of repos and therefore need to be self-describing.
- `union` variants must always include `$type`, except when they are at the top level of `subscription` messages.

It's important to note that `blob` objects always include `$type`, facilitating generic processing.

As a reminder, `main` types must be referenced in `$type` fields using only the `RDSID`, without including a `#main` suffix.

## References

