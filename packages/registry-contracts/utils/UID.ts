import { solidityPackedKeccak256 } from 'ethers';


export const getNodeUID = (name: string, callbackUrl: string, industryCode: string) =>
  solidityPackedKeccak256(['string', 'string', 'string'], [name, callbackUrl, industryCode]);
