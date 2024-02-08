import { DeploymentNetwork } from '../utils/Constants';
import 'dotenv/config';

interface EnvOptions {
  ETHEREUM_BASE_SEPOLIA_PROVIDER_URL?: string;
  DEPLOYER?: string;
}

const {
  ETHEREUM_BASE_SEPOLIA_PROVIDER_URL = '',
  DEPLOYER: deployer = 'ledger://0x0000000000000000000000000000000000000000'
}: EnvOptions = process.env as any as EnvOptions;

export const SupportedNetworks = {
  [DeploymentNetwork.Hardhat]: {
    accounts: {
      count: 20,
      accountsBalance: '10000000000000000000000000000000000000000000000'
    },
    allowUnlimitedContractSize: true,
    saveDeployments: true,
    live: false
  },
  [DeploymentNetwork.BaseSepolia]: {
    chainId: 84532,
    url: ETHEREUM_BASE_SEPOLIA_PROVIDER_URL,
    saveDeployments: true,
    accounts: [deployer].filter(Boolean),
    live: true,
  }
};

// value in key:value pair for the deployer is the index of the account in the accounts array for the matching network
export const NamedAccounts = {
  deployer: {
    [DeploymentNetwork.BaseSepolia]: 0,
    [DeploymentNetwork.Hardhat]: 0
  }
};
