import { ContractFactory, Signer } from 'ethers';
import { ethers } from 'hardhat';
import { ABI } from 'hardhat-deploy/types';
import { NodeRegistry__factory } from '@palette-labs/registry-contracts';

export * from '@palette-labs/registry-contracts';

/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncReturnType<T extends (...args: never) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
/* eslint-enable @typescript-eslint/no-explicit-any */

type Contract<F extends ContractFactory> = AsyncReturnType<F['deploy']>;

export interface ContractBuilder<F extends ContractFactory> {
  metadata: {
    abi: ABI;
    bytecode: string;
  };
  deploy(...args: Parameters<F['deploy']>): Promise<Contract<F>>;
  attach(address: string, passedSigner?: Signer): Promise<Contract<F>>;
}

export type FactoryConstructor<F extends ContractFactory> = {
  new (signer?: Signer): F;
  abi: unknown;
  bytecode: string;
};

export const deployOrAttach = <F extends ContractFactory>(
  FactoryConstructor: FactoryConstructor<F>,
  initialSigner?: Signer
): ContractBuilder<F> => {
  return {
    metadata: {
      abi: FactoryConstructor.abi as ABI,
      bytecode: FactoryConstructor.bytecode
    },
    deploy: async (...args: Parameters<F['deploy']>): Promise<Contract<F>> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const defaultSigner = initialSigner ?? ((await ethers.getSigners())[0] as any as Signer);

      return new FactoryConstructor(defaultSigner).deploy(...(args || [])) as Promise<Contract<F>>;
    },
    attach: attachOnly<F>(FactoryConstructor, initialSigner).attach
  };
};

export const attachOnly = <F extends ContractFactory>(
  FactoryConstructor: FactoryConstructor<F>,
  initialSigner?: Signer
) => {
  return {
    attach: async (address: string, signer?: Signer): Promise<Contract<F>> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const defaultSigner = initialSigner ?? ((await ethers.getSigners())[0] as any as Signer);
      return new FactoryConstructor(signer ?? defaultSigner).attach(address) as Contract<F>;
    }
  };
};

/* eslint-disable camelcase */
const getContracts = (signer?: Signer) => ({
  connect: (signer: Signer) => getContracts(signer),
  NodeRegistry: deployOrAttach(NodeRegistry__factory, signer)
});
/* eslint-enable camelcase */

export default getContracts();

