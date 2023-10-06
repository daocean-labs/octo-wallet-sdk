import { BundlerJsonRpcProvider, UserOperationMiddlewareFn } from "userop";
import { OpToJSON } from "userop/dist/utils";

interface GasEstimate {
    preVerificationGas: bigint;
    verificationGasLimit: bigint;
    callGasLimit: bigint;

    // TODO: remove this with EntryPoint v0.7
    verificationGas: bigint;
}



export const estimateUserOperationGas = (provider: BundlerJsonRpcProvider): UserOperationMiddlewareFn => async (ctx) => {

    const est = await provider.send("eth_estimateUserOperationGas", [OpToJSON(ctx.op), ctx.entryPoint])

    ctx.op.preVerificationGas = est.preVerificationGas;
    ctx.op.verificationGasLimit =
        est.verificationGasLimit ?? est.verificationGas;
    ctx.op.callGasLimit = est.callGasLimit;
}