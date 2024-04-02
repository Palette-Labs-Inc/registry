# RFC: XRPC, A Lighteight HTTP Runtime Validation Wrapper for [Lexicons](./00005-schema-definition-language.md)

- **status:** Draft
- **Author:** Michael Perhats
- **Created:** 03-31-2024
- **Last supportd:** 03-31-2024

## Abstract
The `X` in XRPC is meant to represent the nature of the custom variation of the HTTP standard. Under the hood, XRPC implements standard `GET` and `POST` methods. The RPC simply stands for [remote procedure call](https://en.wikipedia.org/wiki/Remote_procedure_call).

## Introduction
HTTP APIs for client-server and server-server requests in the nosh-protocol network use a set of common conventions called XRPC. Endpoint path names include an [NSID](./00009-namespace-identifiers.md) indicating the [Lexicon](./00005-schema-definition-language.md) specifying the request and response schemas (usually with content-type JSON).

## Motivation
XRPC is simply [HTTP](https://en.wikipedia.org/wiki/HTTP) with some additional, protocol-specific conventions for runtime validation checks on inputs and outputs (request and response bodies respectively). XRPC uses [Lexicon](./00005-schema-definition-language.md) definitions under the hood and maps them to specific methods. 

We considered not implementing Lexicons or XRPC (using [RDF](https://en.wikipedia.org/wiki/RDF_Schema) instead). We decided to introduce Lexicons so that infrastructure hosts engaging in data exchanges and RPC commands across organizations had better guarantees and runtime validations. Especially in distributed systems, software *needs* to correctly handle schemas created by disparate parties. By standardizing a schema definition language (Lexicon), we give developers a common way to define APIs for new markets while ensuring existing infrastructure hosts don't sacrifice on strong type validations. We understand that a decision to introduce a custom schema definition language may be frustrating, but we think Lexicons provide a nice developer UX and people will come to enjoy working in this system.

## Proposal, Lexicon HTTP Endpoints
The HTTP request path starts with `/xrpc/`, followed by an [NSID](./00009-namespace-identifiers.md). Paths must always be top-level, not below a prefix. The NSID maps to the `id` field in the associated [Lexicon](./00005-schema-definition-language.md#at-identifier).

The two requests types that can be expressed in Lexicons are "query" (HTTP GET) and "procedure" (HTTP POST). Following HTTP REST semantics, queries (GET) are cacheable and should not mutate resource state. Procedures are not cacheable and may mutate state.

Lexicon `params` (under the `parameters` field) map to HTTP URL query parameters. Only certain Lexicon types can be included in params, as specified by the `params` type. Multiple query parameters with the same name can be used to represent an array of parameters. When encoding `boolean` parameters, the strings `true` and `false` should be used. Strings should not be quoted. If a `default` value is included in the schema, it should be included in every request to ensure consistent caching behavior.

Request and response body content types can be specified in Lexicon. The schema can require an exact MIME type, or a blob pattern indicating a range of acceptable types (eg, `image/*`).

JSON body schemas are specified in Lexicon using the usual nosh-protocol data model. Full validation by the server or client requires knowledge of the Lexicon, but partial validation against the abstract data model is always possible.

CORS support is encouraged but not required.

### Error Responses
All unsuccessful responses should follow a standard error response schema. The `Content-Type` should be `application/json`, and the payload should be a JSON object with the following fields:

- `error` (string, required): type name of the error (generic ASCII constant, no whitespace)
- `message` (string, optional): description of the error, appropriate for display to humans

The error type should map to an error name defined in the endpoint's Lexicon schema. This enables more specific error-handling by client software. This is particularly encouraged on `400`, `500`, and `502` status codes, where further information will be useful.

### Blob Upload and Download
Blobs are something of a special case because they can have any MIME type and are not stored directly in repositories, and thus are not directly associated with an NSID or Lexicon (though they do end up referenced from Lexicons).

The convention for working with blobs is for clients to upload them via the `xyz.nosh.repo.uploadBlob` endpoint, which returns a `blob` JSON object containing a CID and basic metadata about the blob. Client can then include this `blob` data in future requests (eg, include in new records). Constraints like MIME type and file size are only validated at this second step. The server may implement content type sniffing at the upload step and return a MIME type different from any `Content-Type` header provided, but a `Content-Type` header is still expected on the upload HTTP request.

Blobs for a specific account can be listed and downloaded using endpoints in the `xyz.noshl.sync.*` NSID space. These endpoints give access to the complete original blob, as uploaded. A common pattern is for applications to mirror both the original blob and any downsized thumbnail or preview versions via separate URLs (eg, on a CDN), instead of deep-linking to the `getBlob` endpoint on the original PDS.

### Cursors and Pagination
A common pattern in Lexicon design is to include a `cursor` parameter for pagination. The client should not include the `cursor` parameter in the first request, and should keep all other parameters fixed between requests. If a cursor is included in a response, the next batch of responses can be fetched by including that value in a follow-on, continuing until the cursor is not included any longer, indicating the end of the result set has been reached.

## Authentication, WebAuthN
TODO

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