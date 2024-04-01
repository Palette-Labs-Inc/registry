## Initial Client-to-Server Request Signing and Submission

### Client Side Signing:
When an `agent` (either a Buyer or Provider) uses a protocol enabled client application, they will authorize the client to sign transactions on their behalf by adding a *Signer* to the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry). A _Signer_ is an Ed25519[1](https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md#user-content-fn-ed25519-20ca98ebc54d674b56cc47326c811976) key pair that clients can use to authorize messages (http requests) to the network.

An agent authorizes a client's Signer with a signature from their `custody address` currently holding their Agent Identifier `aid`. The client can use the Signer to authorize actions within the network on behalf of the agent. Agents can revoke a Signer at any time with a signature from their `custody address`. A Signer is added or removed by registering the public key of the signer to an `aid` with a smart contract at a well known address. Signers can only be added for the `aid` owned by the caller of the contract.

The `PDS` can then verify the signatures from the client and ensure the Signer is valid against the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry).

A protocol enabled client makes HTTP requests, and uses a *Signer* to sign requests for the agent that they are currently representing. Clients can choose a 1:1, or 1:N relationship between users and Signers. 

Clients generate a short-lived JWT that they include in the in the HTTP request within an `Authorization` signature header.

The JWT parameters are:
- `alg` header field: indicates the signing key type (see [Cryptography](TODO))
    - use `ES256K` for `k256` keys, all requests are signed with the ES256K algorithm (secp256k1 signing)
- `iss` body field: account DID that the request is being sent on behalf of. This may include a suffix service identifier; see below
- `aud` body field: service DID associated with the service that the request is being sent to
- `exp` body field: token expiration time, as a UNIX timestamp with seconds precision. 
- `aid` body field:: the [`Agent Identifier`](./00003-identity-contracts.md#agent-identifiers).
 
The signature is computed using the regular JWT process, using the clients signing key. In Typescript, this looks like:
```ts
const headerPayload = utf8ToBase64Url(jsonStringify(header)) + '.' + utf8ToBase64Url(jsonString(body))
const signature = hashAndSign(accountSigningKey, utf8Bytes(headerPayload))
const jwt = headerPayload + '.' + bytesToBase64Url(signature)
```

### Submission to the Initial Server:
The client-signed request is then sent to the `agents` `PDS`. The PDS verifies the client's JWT using the public key listed in the [`Signature Authority Registry`](./00003-identity-contracts.md#signature-authority-registry) under a registered / delegated signer of the `agent` as represented by the `aid` from the decoded JWT.

## Server-to-Server Forwarding Including Client Signature

### Initial Server Processing:

- Upon successful verification of the client's JWT, the initial server decides whether the request needs to be forwarded to another server.
- If forwarding is required, the initial server generates its own JWT to sign the request. This JWT includes:
  - `alg`: ES256K.
  - `iss`: Initial `PDS` ID.
  - `aud`: Receiving `PDS` ID.
  - `exp`: Token expiration time (60 seconds recommended).
- The initial server includes both JWTs in the forwarded request: the original client JWT and its own. The client's JWT is forwarded within an `X-Forwarded-Authorization` header, and the server's JWT is included in the `Authorization` header.

### Forwarding Mechanism:

- A special header, `X-Nosh-Delegation`, is added to indicate the request flow type:
  - `client->server->server` for client-initiated requests that are forwarded.
  - `server->server` for direct server-to-server requests.

## Receiving Server Processing and Verification

### Verification of Signatures:

- The receiving server extracts and verifies the JWT in the `Authorization` header to authenticate the immediate sender.
- If the `X-Nosh-Delegation` header indicates a client-to-server-to-server flow, the receiving server also verifies the original client JWT from the `X-Forwarded-Authorization` header.
- Verification involves checking the JWTs against the public keys stored in the Node Registry for the corresponding `iss` IDs.

### Handling and Response:

- Only after both signatures (if present) are verified does the receiving server process the request.
- If any signature fails verification, the server responds with an appropriate error code and message detailing the failure.

















The `PDS` acts as a generic proxy between clients and other nosh-protocol services. 

In order to be discovered in the nosh-protocol network, a `PDS` creates a key pair and registers with the [Node Registry](./00002-node-registry.md) as either a `BSN` or `PSN`. The public key is stored on the blockchain in the network registry along with a unique identifier. When communicating with other Node's in the network, a *sending* `PDS` signs the data that they are sending over the network, including the signature hash in the header of the HTTP request. When this message is received by a *receiving* Node, the receiving should query the registry for the *sending* Node's public key and use the signature in the request header to verify the message. If the message is successfully verified, the *receiving* `PDS` can know that the *sending* `PDS` is properly registered and their message has not been tampered. If the *sending* `PDS`'s message is unable to be verified, the *receiving* `PDS` should respond to the *sending* `PDS`s request with an error code. 

JWTs are signed payloads from the `PDS` signing key that match the public key from the PDS entry in the [`Node Registry`](./00002-node-registry.md). The receiving service can validate the signature by checking the public key against the entry in the `Node Registry` contract. The proposed mechanism will use short-lived [JWTs](https://en.wikipedia.org/wiki/JSON_Web_Token).

The JWT parameters are:
- `alg` header field: indicates the signing key type (see [Cryptography](TODO...))
    - use `ES256K` for `k256` keys, all requests are signed with the ES256K algorithm (secp256k1 signing)
- `iss` body field: the uid of the `PDS` that the request is being sent on behalf of.
- `aud` body field: the uid of the `PDS` that the the request is being sent to
- `exp` body field: token expiration time, as a UNIX timestamp with seconds precision. Should be a short time window, as revocation is not implemented. 60 seconds is a good value.

- JWT signature: base64url-encoded signature using the account `PDS`s signing key

The signature is computed using the regular JWT process, using the account's signing key (the same used to sign repo commits). As Typescript pseudo-code, this looks like:

```ts
const headerPayload = utf8ToBase64Url(jsonStringify(header)) + '.' + utf8ToBase64Url(jsonString(body))
const signature = hashAndSign(accountSigningKey, utf8Bytes(headerPayload))
const jwt = headerPayload + '.' + bytesToBase64Url(signature)
```
