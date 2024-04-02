# URI Standards
- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
Generally, A [Uniform Resource Identifier (URI)](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) is a unique sequence of characters that identifies a resource in a system. Here we propose the standards for resource identifiers in the nosh network.

## Motivation
To provide a standard reference framework for identifying records within a repository.

## Proposal
The NOSH URI scheme (`nosh://`) should support references to individual records in a specific repository identified by either [`custody address`](./00003-identity-contracts.md), or an [account identifier](./00003-identity-contracts.md#account-identifiers). Both options serve generally as resource identifiers.

Both of these NOSH URIs reference the same address record in the same repository; one uses the [Account Identifier](./00003-identity-contracts.md#account-identifiers), and one uses the repository owners `custody address`.
- `nosh://1673/nosh.server.buyer.address/3jwdwj2ctlk26`
- `nosh://0xb794f5ea0ba39494ce839613fffba74279579268/nosh.server.buyer.address/3jwdwj2ctlk26`

### Structure
The full structure of a NOSH URI is:

```shell
"nosh://" AUTHORITY [ PATH ] [ "?" QUERY ] [ "#" FRAGMENT ]
```
The **authority** part of the URI can be either an `custody address` or an [account identifier](./00003-identity-contracts.md#account-identifiers), indicating the identity associated with the repository.

In [NSDL](./00009-namespace-identifiers.md) use, the **query** and **fragment** URI parts are not supported. (todo, explain)
```shell
"nosh://" AUTHORITY [ "/" COLLECTION [ "/" RKEY ] ]
```

**canonical constants**:
- the **authority** part is required
- the **authority** part must resolve to a valid value for `custody address` or `account identifer`
- the optional **collection** part must be normalized [RDSID](./00009-namespace-identifiers.md)
- the optional **rkey** part must be a valid [Record Key](./00007-record-keys.md)

Common URL formats like `https://` or `wss://` with an "authority" part typically point to a specific location of a resource. Because our system is content-addresed, this is not the case for NOSH-URIs

### Compliance
NOSH URIs meet the generic syntax requirements of [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986). They utilize some generic URI features outlined in that 

### Supported URI Parts and Features:
- **[Authority part](https://www.rfc-editor.org/rfc/rfc3986#section-3.2)**, prefixed with a double slash: supported
- **[Path part](https://www.rfc-editor.org/rfc/rfc3986#section-3.3)**: supported, optional
- **[Query](https://www.rfc-editor.org/rfc/rfc3986#section-3.4)**: supported in general syntax, not currently used
- **[Fragment](https://www.rfc-editor.org/rfc/rfc3986#section-3.5)**: supported in general syntax, not currently used

### *Currently* Not Supported URI Parts and Features:
- **[Userinfo part](https://www.rfc-editor.org/rfc/rfc3986#section-3.2.1)**: not currently supported, but reserved for future use. A lone `@` character preceding an account identifier is not valid (e.g., `nosh://@1673` is invalid)
- **[Host and port separation](https://www.rfc-editor.org/rfc/rfc3986#section-3.2.2)**: not supported.
- **[Relative references](https://www.rfc-editor.org/rfc/rfc3986#section-4.2)**: not yet supported

### Full Syntax

**canonical constants**:
- The URI is limited to a specific range of ASCII characters.
- As specified in [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986), the unreserved characters include alphanumeric (`A-Za-z0-9`), along with the period, hyphen, underscore, and tilde (`.-_~`).
- The total length of the URI is capped at 8 kilobytes
- Characters may be hex-encoded (not required)
- The URI scheme employed is `nosh`, mandating the presence of an authority part introduced by double slashes, thus beginning every URI with `nosh://`.
- The authority component is mandatory and must contain data. This can be a nosh-protocol recognized `custody address`, or [account identifier](./00003-identity-contracts.md#account-identifiers) (no quotes)
- An optional path section can be included, with the possibility of multiple segments divided by a single slash (`/`). Standard URI path normalization practices are applicable.

### Restricted NOSH URI Syntax
Currently, the [NSDL](./00009-namespace-identifiers.md) employs a specific subset of NOSH URIs, designated for the `nosh-uri` type with the following rules:
- Trailing slashes, including those following the authority without additional path elements, are prohibited.
- The URI must adhere to normalization standards outlined below, with normalized sub-identifiers.

```shell
NOSH-URI      = "nosh://" AUTHORITY [ "/" COLLECTION [ "/" RKEY ] ]
AUTHORITY     = address | account-identifer
COLLECTION    = RDSID
RKEY          = RECORD-KEY
```

### Normalization
Strict normalization should be followed to ensure reproduciblity. Results should be reducible to a basic string equality check.
- Ensure URI schema is lowercase
- Avoid unnecessary hex-encoding throughout the URI
- Utilize uppercase hex characters if hex-encoding is necessary
- Exclude query and fragment parts when referencing repos or records
- Normalize RDSID in path by lowercasing the domain authority part
- Prevent trailing slashes in the path part
- Maintain case sensitivity for Record Keys and refrain from normalization
- Eliminate duplicate slashes or "." sections in the path part (e.g., `/./` or `/abc/../`)

Refer to [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986) path normalization rules and rules to remove `..` / `.` relative references.

### Examples

**Valid NOSH URIs (both general and NSDL syntax)**:
```shell
nosh://0xb794f5ea0ba39494ce839613fffba74279579268/com.example.foo/123
nosh://1673/com.example.foo/123
```

**Valid general NOSH URI syntax, invalid in NSDL**:
```shell
nosh://foo.com/example/123     // invalid RDSID (would correct to com.foo.example)
nosh://computer                // not a valid account identifier or `custody address`
nosh://example.com:3000        // not a valid account identifier or `custody address`
```

**Invalid NOSH URI (in both contexts)**:
```shell
nosh://foo.com/                // trailing slash
nosh://user:pass@foo.com       // userinfo not currently supported
```

## References
- [Uniform Resource Identifier (URI)](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
- [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986)
- [RFC-3986](https://www.rfc-editor.org/rfc/rfc3986)