import { NamedAccounts, SupportedNetworks } from './data/NamedAccounts';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-solhint';
import 'dotenv/config';
import 'hardhat-contract-sizer';
import { HardhatUserConfig } from 'hardhat/config';
import { MochaOptions } from 'mocha';

interface EnvOptions {
  ETHERSCAN_API_KEY?: string;
  PROFILE?: boolean;
}

const { ETHERSCAN_API_KEY, PROFILE: isProfiling }: EnvOptions = process.env as any as EnvOptions;

const mochaOptions = (): MochaOptions => {
  let timeout = 600000;
  let grep;
  let reporter;

  if (isProfiling) {
    timeout = 0;
    reporter = 'mocha-silent-reporter';
  }

  return {
    timeout,
    color: true,
    bail: true,
    grep,
    reporter
  };
};

const config: HardhatUserConfig = {
  networks: SupportedNetworks,
  namedAccounts: NamedAccounts,

  paths: {
    deploy: ['deploy/scripts']
  },

  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000
      },
      metadata: {
        bytecodeHash: 'none'
      }
    }
  },

  typechain: {
    target: 'ethers-v6'
  },

  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY
    }
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false
  },

  gasReporter: {
    currency: 'USD',
    enabled: isProfiling
  },

  mocha: mochaOptions()
};

export default config;
