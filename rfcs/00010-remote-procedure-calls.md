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

The convention for working with blobs is for clients to upload them via the `com.nosh-protocol.repo.uploadBlob` endpoint, which returns a `blob` JSON object containing a CID and basic metadata about the blob. Client can then include this `blob` data in future requests (eg, include in new records). Constraints like MIME type and file size are only validated at this second step. The server may implement content type sniffing at the upload step and return a MIME type different from any `Content-Type` header provided, but a `Content-Type` header is still expected on the upload HTTP request.

Blobs for a specific account can be listed and downloaded using endpoints in the `com.nosh-protocol.sync.*` NSID space. These endpoints give access to the complete original blob, as uploaded. A common pattern is for applications to mirror both the original blob and any downsized thumbnail or preview versions via separate URLs (eg, on a CDN), instead of deep-linking to the `getBlob` endpoint on the original PDS.

### Cursors and Pagination
A common pattern in Lexicon design is to include a `cursor` parameter for pagination. The client should not include the `cursor` parameter in the first request, and should keep all other parameters fixed between requests. If a cursor is included in a response, the next batch of responses can be fetched by including that value in a follow-on, continuing until the cursor is not included any longer, indicating the end of the result set has been reached.

## Authentication, WebAuthN
TODO

## References 
- [HTTP](https://en.wikipedia.org/wiki/HTTP)
- [remote procedure call](https://en.wikipedia.org/wiki/Remote_procedure_call)
- [Json Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token)