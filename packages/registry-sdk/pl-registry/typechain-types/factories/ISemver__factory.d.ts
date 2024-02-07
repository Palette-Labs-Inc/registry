import { type ContractRunner } from "ethers";
import type { ISemver, ISemverInterface } from "../ISemver";
export declare class ISemver__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "version";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ISemverInterface;
    static connect(address: string, runner?: ContractRunner | null): ISemver;
}
//# sourceMappingURL=ISemver__factory.d.ts.map