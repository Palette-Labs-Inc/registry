# NRPC, A Lighteight HTTP Runtime Validation Wrapper for [NSDL](./00005-schema-definition-language.md)

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
NRPC is a simple wrapper around HTTP that provides runtime validation for inputs and outputs from [The NSDL](./00005-schema-definition-language.md)

## Introduction
HTTP APIs for client-server and server-server requests in the nosh-protocol network use a set of common conventions called NRPC. Endpoint path names include an [RDSID](./00009-namespace-identifiers.md) indicating the [NSDL](./00005-schema-definition-language.md) document specifying the request and response schemas (usually with content-type JSON).

## Motivation
NRPC is simply [HTTP](https://en.wikipedia.org/wiki/HTTP) with some protocol-specific conventions for runtime validation checks on inputs and outputs (request and response bodies respectively). NRPC uses [NSDL](./00005-schema-definition-language.md) definitions under the hood and maps them to specific methods. 

We considered not implementing NSDL or NRPC (using [RDF](https://en.wikipedia.org/wiki/RDF_Schema) instead). We decided to introduce NSDL so that infrastructure hosts engaging in data exchanges and RPC commands across organizations had better guarantees and runtime validations. Especially in distributed systems, software *needs* to correctly handle schemas created by disparate parties. By standardizing a schema definition language, we give developers a common way to define APIs for new markets while ensuring existing infrastructure hosts don't sacrifice on strong type validations. We understand that a decision to introduce a custom schema definition language may be frustrating, but we think the NSDL standards provide a nice developer UX and people will come to enjoy working in this system.

## Proposal, NSDL Endpoints
The HTTP request path starts with `/nrpc/`, followed by an [RDSID](./00009-namespace-identifiers.md). Paths must always be top-level, not below a prefix. The RDSID maps to the `id` field in the associated [NSDL](./00005-schema-definition-language.md#at-identifier) document.

NSDL schema files support types of "query" (HTTP GET) and "mutation" (HTTP POST). Following HTTP REST semantics, queries (GET) are cacheable and should not mutate resource state. Mutations are not cacheable and may mutate state.

**NRPC Notes:**
- NSDL `params` map to HTTP URL "query parameters". Only certain NSDL types can be included in params, as specified by the `params` type. 
- Multiple query parameters with the same name can be used to represent an array of parameters. 
- When encoding `boolean` parameters, the strings `true` and `false` should be used (strings should not be quoted).
- If a `default` value is included in the schema, it should be included in every request to ensure consistent caching behavior.

Request and response body content types can be specified in NSDL. 

### Error Responses
All unsuccessful responses should adhere to a standardized error response schema. The `Content-Type` should be `application/json`, and the payload should consist of a JSON object with the following fields:
- `error` (string, required): type name of the error (generic ASCII constant, no whitespace)
- `message` (string, optional): description of the error, appropriate for display to humans

The error type should correspond to an error name specified in the endpoint's NSDL schema. This facilitates more precise error-handling by client software. This is especially recommended for status codes such as `400`, `500`, and `502`, where additional information can be beneficial.

### Blob Upload and Download
- Blobs can have *any* MIME type
- Blobs are not stored directly in [data repos](./00006-data-repositories.md), and are not directly associated with an `RDSID`.

TODO: update docs afte defining the api spec for handling blobs / media types.

### Cursor Based Pagination
TODO: update docs afte defining the api spec for handling paginated data types.

## Authentication, WebAuthN
TODO: update docs afte defining the api spec for registration.

### Client-to-Server Authentication:
When an `account` (user) (either a Buyer or Provider) uses a protocol enabled client application, they will authorize the client to sign transactions on their behalf by adding a *Signer* to the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry). A _Signer_ is an Ed25519[1](https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md#user-content-fn-ed25519-20ca98ebc54d674b56cc47326c811976) key pair that clients can use to authorize messages (http requests) to the network.

An account authorizes a clients key as a delegated signer (called a *Signer* in this doc) with a signature from their `custody address` currently holding their Account Identifier `aid`. The client can use the Signer to authorize actions within the network on behalf of the account. Accounts can revoke a Signer at any time with a signature from their `custody address`. A Signer is added or removed by registering the public key of the signer to an `aid` with a smart contract. Signers can only be added for the `aid` owned by the caller of the contract.

The `PDS` can then verify the signatures from the client and ensure the Signer is valid against the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry).

A protocol enabled client makes HTTP requests, and uses a *Signer* to sign requests for the account that they are currently representing. Clients can choose a 1:1, or 1:N relationship between users and Signers. 

Clients generate a short-lived JWT that they include in the in the HTTP request within an `Authorization` signature header.

The JWT parameters are:
- `alg` header field: indicates the signing key type (see [Cryptography](TODO))
    - Use `EdDSA` for Ed25519 keys, all requests are signed with the EdDSA algorithm (Ed25519 signing).
- `aud` body field: the uid for an entry in the [`Node Registry`](./00002-node-registry.md) associated with the service that the request is being sent to
- `exp` body field: token expiration time, as a UNIX timestamp with seconds precision. 
- `aid` body field: the [`Account Identifier`](./00003-identity-contracts.md#account-identifiers).

The client-signed request is then sent to the `accounts` `PDS`. The PDS verifies the client's JWT using the public key listed in the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry).  


### Server-to-Server Authentication:
Upon successful verification of the client's JWT, the initial server decides whether the request needs to be forwarded to another server.

Clients can also opt to use the `X-Nosh-Delegation-Proxy` header to specify which service in the network they want the request forwarded to (eg, a search gateway, or a specific `PDS`). The PDS will execute some safety checks, then forward the request with an inter-service authentication token (JWT, described above) issued and signed by the `PDS`s identity.

An example request header from a client to proxy the request to a `PSN` service with uid "0x56e3B524302Ec60Ec7850aF492D079367E03e5fb"

```bash
X-Nosh-Delegation-Proxy: psn:0x56e3B524302Ec60Ec7850aF492D079367E03e5fb
```

In order to be discovered in the nosh-protocol network, a `PDS` creates a key pair and registers with the [Node Registry](./00002-node-registry.md) as either a `BSN` or `PSN`. The public key is stored on the blockchain in the network registry along with a unique identifier. When communicating with other Node's in the network, a *sending* `PDS` signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, the receiving should query the registry for the *sending* Node's public key and use the signature in the request header to verify the message. If the message is successfully verified, the *receiving* `PDS` can know that the *sending* `PDS` is properly registered and their message has not been tampered. If the *sending* `PDS`'s message is unable to be verified, the *receiving* `PDS` should respond to the *sending* `PDS`s request with an error code. 

JWTs are signed payloads from the `PDS` signing key that match the public key from the PDS entry in the [`Node Registry`](./00002-node-registry.md). The receiving service can validate the signature by checking the public key against the entry in the `Node Registry` contract. The proposed mechanism will use short-lived [JWTs](https://en.wikipedia.org/wiki/JSON_Web_Token).

The JWT parameters are:
- `alg` header field: indicates the signing key type (see [Cryptography](TODO...))
    - use `ES256K` for `k256` keys, all requests are signed with the ES256K algorithm (secp256k1 signing)
- `iss` body field: the uid of the `PDS` that the request is being sent on behalf of.
- `aud` body field: the uid of the `PDS` that the the request is being sent to
- `exp` body field: token expiration time, as a UNIX timestamp with seconds precision. Should be a short time window, as revocation is not implemented. 60 seconds is a good value.

- JWT signature: base64url-encoded signature using the account `PDS`s signing key

## Example
The signature for both client-to-server and server-to-server requests is written in Typescript like this:
```ts
const headerPayload = utf8ToBase64Url(jsonStringify(header)) + '.' + utf8ToBase64Url(jsonString(body))
const signature = hashAndSign(signingKey, utf8Bytes(headerPayload))
const jwt = headerPayload + '.' + bytesToBase64Url(signature)
```

## Summary of HTTP Headers
Clients can use the following request headers:

`Content-Type`: If a request body is present, this header should be included and indicate the content type.

`Authorization`: Contains auth information. See "Authentication" section of this specification for details.

`X-Nosh-Delegation-Proxy`: used for proxying to other nosh-protocol services. See "Service Proxying" section of this document for details.

## Summary of HTTP Status Codes

## 2xx Success
- `200 OK`: The request was successful, and the response body contains the requested data.
- `201 Created`: The request was successful, and a new resource was created as a result.
- `202 Accepted`: The request has been accepted for processing, but the processing has not been completed.
- `204 No Content`: The server successfully processed the request, but is not returning any content.

## 4xx Client Error
- `400 Bad Request`: The request cannot be fulfilled due to bad syntax.
- `401 Unauthorized`: Authentication is required and has failed or has not yet been provided.
- `403 Forbidden`: The server refuses to respond to the request.
- `404 Not Found`: The requested resource could not be found.
- `405 Method Not Allowed`: The request method is not supported for the requested resource.

## 5xx Server Error
- `500 Internal Server Error`: A generic error message when the server encounters an unexpected condition.
- `501 Not Implemented`: The server does not support the functionality required to fulfill the request.
- `502 Bad Gateway`: The server received an invalid response from an upstream server.
- `503 Service Unavailable`: The server is currently unavailable (due to overload or maintenance).
- `504 Gateway Timeout`: The server did not receive a timely response from an upstream server.

## References 
- [HTTP](https://en.wikipedia.org/wiki/HTTP)
- [remote procedure call](https://en.wikipedia.org/wiki/Remote_procedure_call)
- [Json Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token)