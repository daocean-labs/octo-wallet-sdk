import { BundlerJsonRpcProvider, UserOperationMiddlewareFn } from "userop";
import { OpToJSON } from "userop/dist/utils";

interface GasEstimate {
  preVerificationGas: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;

  // TODO: remove this with EntryPoint v0.7
  verificationGas: bigint;
}

export const estimateUserOperationGas =
  (provider: BundlerJsonRpcProvider): UserOperationMiddlewareFn =>
  async (ctx) => {
    //set default
    ctx.op.callGasLimit = 10e6;
    ctx.op.verificationGasLimit = 10e6;
    ctx.op.preVerificationGas = 1000e6;

    const est = await provider.send("eth_estimateUserOperationGas", [
      OpToJSON(ctx.op),
      ctx.entryPoint,
    ]);
    console.log("Pre verification gas", est.preVerificationGas);
    ctx.op.preVerificationGas = est.preVerificationGas;
    ctx.op.verificationGasLimit =
      est.verificationGasLimit ?? est.verificationGas;
    ctx.op.callGasLimit = est.callGasLimit;
  };
