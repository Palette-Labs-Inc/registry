import { solidityPackedKeccak256 } from 'ethers';
import { NodeEntryStruct } from '../typechain-types/INodeRegistry';

export const getNodeUID = ({ name, callbackUrl, industryCode }: NodeEntryStruct) =>
  solidityPackedKeccak256(['string', 'string', 'string'], [name, callbackUrl, industryCode]);