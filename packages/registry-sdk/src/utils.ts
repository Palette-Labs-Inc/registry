import {
  solidityPackedKeccak256,
  ZeroAddress
} from 'ethers';

export const ZERO_ADDRESS = ZeroAddress;
export const ZERO_BYTES = '0x';
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

// TODO: resolve to use import { NodeEntryStruct } from '../typechain-types/INodeRegistry';

export const getNodeUID = (name: string, callbackUrl: string, industryCode: string) =>
  solidityPackedKeccak256(['string', 'string', 'string'], [name, callbackUrl, industryCode]);

 
// HTTP utils
export function base64UrlEncode(input: string): string {
  const base64 = Buffer.from(input).toString('base64');
  let base64Url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64Url;
}

export function base64UrlDecode(base64UrlString: string): string {
  let base64 = base64UrlString.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding to Base64 string if needed
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) {
    base64 += '='.repeat(padding);
  }
  const bytes = Buffer.from(base64, 'base64').toString('utf-8');
  return bytes;
}

// Signature header utils
interface SignatureComponents {
  keyId: string;
  algorithm: string;
  created: number;
  expires: number;
  headers: string;
  signature: string;
}

type TempSignatureComponents = {
  [key: string]: string | number;
};

export function parseAuthorizationHeader(header: string): SignatureComponents {
  const components: TempSignatureComponents = {};
  const regex = /(\w+)="([^"]+)"(?:,\s*)?/g;
  let match;
  
  while ((match = regex.exec(header)) !== null) {
      const [ , key, value ] = match;
      // Directly assign to components since it now accepts string keys
      components[key] = key === 'created' || key === 'expires' ? parseInt(value, 10) : value;
  }

  // Validate and cast the parsed object to SignatureComponents before returning
  if (!components.keyId || !components.algorithm || components.created === undefined || components.expires === undefined || !components.headers || !components.signature) {
      throw new Error('Malformed Authorization header');
  }

  return {
      keyId: components.keyId,
      algorithm: components.algorithm,
      created: components.created,
      expires: components.expires,
      headers: components.headers,
      signature: components.signature
  } as SignatureComponents;
}