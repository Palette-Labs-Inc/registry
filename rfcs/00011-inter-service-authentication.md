
### Client-to-Server Authentication:
When an `agent` (either a Buyer or Provider) uses a protocol enabled client application, they will authorize the client to sign transactions on their behalf by adding a *Signer* to the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry). A _Signer_ is an Ed25519[1](https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md#user-content-fn-ed25519-20ca98ebc54d674b56cc47326c811976) key pair that clients can use to authorize messages (http requests) to the network.

An agent authorizes a clients key as a delegated signer (called a *Signer* in this doc) with a signature from their `custody address` currently holding their Agent Identifier `aid`. The client can use the Signer to authorize actions within the network on behalf of the agent. Agents can revoke a Signer at any time with a signature from their `custody address`. A Signer is added or removed by registering the public key of the signer to an `aid` with a smart contract. Signers can only be added for the `aid` owned by the caller of the contract.

The `PDS` can then verify the signatures from the client and ensure the Signer is valid against the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry).

A protocol enabled client makes HTTP requests, and uses a *Signer* to sign requests for the agent that they are currently representing. Clients can choose a 1:1, or 1:N relationship between users and Signers. 

Clients generate a short-lived JWT that they include in the in the HTTP request within an `Authorization` signature header.

The JWT parameters are:
- `alg` header field: indicates the signing key type (see [Cryptography](TODO))
    - Use `EdDSA` for Ed25519 keys, all requests are signed with the EdDSA algorithm (Ed25519 signing).
- `aud` body field: service DID associated with the service that the request is being sent to
- `exp` body field: token expiration time, as a UNIX timestamp with seconds precision. 
- `aid` body field: the [`Agent Identifier`](./00003-identity-contracts.md#agent-identifiers).
 

The client-signed request is then sent to the `agents` `PDS`. The PDS verifies the client's JWT using the public key listed in the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry).  


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
const signature = hashAndSign(accountSigningKey, utf8Bytes(headerPayload))
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