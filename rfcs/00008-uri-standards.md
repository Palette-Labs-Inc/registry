# RFC: URI Standards
- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
Generally, A [Uniform Resource Identifier (URI)](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) is a unique sequence of characters that identifies a resource in a system. Here we propose the standards for resource identifiers in the nosh network.

## Motivation
To provide a standard reference framework for identifying records within a repository.

## Proposal
The NOSH URI scheme (`nosh://`) should support references to individual records in a specific repository identified by either [ethereum address](./00003-identity-contracts.md), or an [Agent Identifier](./00003-identity-contracts.md#agent-identifiers) based resource identifiers.

Both of these NOSH URIs reference the same address record in the same repository; one uses the [Agent Identifier](./00003-identity-contracts.md#agent-identifiers), and one uses the repository owners ethereum address.
- `nosh://1673/nosh.server.buyer.address/3jwdwj2ctlk26`
- `nosh://0xb794f5ea0ba39494ce839613fffba74279579268/nosh.server.buyer.address/3jwdwj2ctlk26`

**Caveats for NOSH URIs**
NOSH URIs are not content-addressed, so the _contents_ of the record they refer to may also change over time.

### Structure
The full, general structure of a NOSH URI is:

```shell
"nosh://" AUTHORITY [ PATH ] [ "?" QUERY ] [ "#" FRAGMENT ]
```
The **authority** part of the URI can be either an ethereum address or an [Agent Identifier](./00003-identity-contracts.md#agent-identifiers), indicating the identity associated with the repository. 

In current nosh-protocol Lexicon use, the **query** and **fragment** parts are not yet supported, and only a fixed pattern of paths are allowed:

```shell
"nosh://" AUTHORITY [ "/" COLLECTION [ "/" RKEY ] ]
```

The **authority** section is required and must be normalized. The optional **collection** part of the path must be a normalized [NSID](./00009-namespace-identifiers.md). The optional **rkey** part of the path must be a valid [Record Key](./00007-record-keys.md).

A major semantic difference between NOSH URIs and common URL formats like `https://`, `ftp://`, or `wss://` is that the "authority" part of A NOSH URI does not indicate a network location for the indicated resource.

### Generic URI Compliance
NOSH URIs meet the generic syntax for Universal Resource Identifiers, as defined in IETF [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986). They utilize some generic URI features outlined in that document. As a summary of generic URI parts and features:
- Authority part, preceded by double slash: supported
- Empty authority part: not supported
- Userinfo: not currently supported, but reserved for future use. a lone `@` character preceding an agent identifier is not valid (eg, `nosh://@1673` is invalid)
- Host and port separation: not supported.
- Path part: supported, optional
- Query: supported in general syntax, not currently used
- Fragment: supported in general syntax, not currently used
- Relative references: not yet supported
- Normalization rules: supported in general syntax, not currently used

### Full NOSH URI Syntax
The full syntax for NOSH URIs is flexible to a variety of future use cases, including future extensions to the path structure, query parameters, and a fragment part. The full syntax rules are:

- The overall URI is restricted to a subset of ASCII characters
- For reference below, the set of unreserved characters, as defined in [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986), includes alphanumeric (`A-Za-z0-9`), period, hyphen, underscore, and tilde (`.-_~`)
- Maximum overall length is 8 kilobytes (which may be shortened in the future)
- Hex-encoding of characters is permitted (but not typically necessary)
- The URI scheme is `nosh`, and an authority part preceded with double slashes is always required, so the URI always starts `nosh://`
- An authority section is required and must be non-empty. the authority can be either a nosh-protocol registered ethereum address, or an [Agent Identifier](./00003-identity-contracts.md#agent-identifiers). 
- An optional path section may follow the authority. The path may contain multiple segments separated by a single slash (`/`). Generic URI path normalization rules may be used.
- An optional query part is allowed, following generic URI syntax restrictions
- An optional fragment part is allowed, using JSON Path syntax

### Restricted NOSH URI Syntax
A restricted sub-set of valid NOSH URIs are currently used in Lexicons for the `nosh-uri` type. Query parameters and fragments are not currently used. Trailing slashes are not allowed, including a trailing slash after the authority with no other path. The URI should be in normalized form (see "Normalization" section), with all of the individual sub-identifiers also normalized.

```shell
NOSH-URI        = "nosh://" AUTHORITY [ "/" COLLECTION [ "/" RKEY ] ]
AUTHORITY     = address | agent-identifer
COLLECTION    = NSID
RKEY          = RECORD-KEY
```

### Normalization
Particularly when included in nosh-protocol records, strict normalization should be followed to ensure that the representation is reproducible and can be used with simple string equality checks.

- No unnecessary hex-encoding in any part of the URI
- Any hex-encoding hex characters must be upper-case
- URI schema is lowercase
- No trailing slashes in path part
- No duplicate slashes or "dot" sections in path part (`/./` or `/abc/../` for example)
- NSID in path: domain authority part lowercased
- Record Key is case-sensitive and not normalized
- Query and fragment parts should not be included when referencing repositories or records in Lexicon records

Refer to [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986) for generic rules to normalize paths and remove `..` / `.` relative references.

### Examples

**Valid NOSH URIs (both general and Lexicon syntax)**:
```shell
nosh://1673/nosh.server.buyer.address/3jwdwj2ctlk26
```

**Valid general NOSH URI syntax, invalid in current Lexicon**:
```shell
nosh://foo.com/example/123     // invalid NSID
nosh://computer                // not a valid agent identifier or ethereum address
nosh://example.com:3000        // not a valid agent identifier or ethereum address
```

**Invalid NOSH URI (in both contexts)**:
```shell
nosh://foo.com/                // trailing slash
nosh://user:pass@foo.com       // userinfo not currently supported
```

### Usage and Implementation Guidelines
Generic URI and URL parsing libraries can sometimes be used with NOSH URIs, but not always. A key requirement is the ability to work with the authority (or origin) part of the URI as a simple string, without being parsed in to userinfo, host, and port sub-parts. Specifically: the Python 3 `urllib` module (from the standard library) works; the Javascript `url-parse` package works; the Golang `net/url` package does not work; and most of the popular Rust URL parsing crates do not work.

When referencing records, especially from other repositories, best practice is to use an `agent-identifier` in the authority part. 

When a _strong_ reference to another record is required, best practice is to use a CID hash in addition to the NOSH URI.

In Lexicons (APIs, records, and other contexts), sometimes a specific variant of A NOSH URI is required, beyond the general purpose `nosh-uri` string format. For example, references to records from inside records usually require an `agent-identifier` in the authority section, and the URI must include the collection and rkey path segments. URIs not meeting these criteria will fail to validate.

Do not confuse the JSON Path fragment syntax with the Lexicon reference syntax. They both use `#`-based fragments to reference other fields in JSON documents, but, for example, JSON Path syntax starts with a slash (`#/key`).

## References
- [Uniform Resource Identifier (URI)](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
- [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986)
- [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986)