import { JsonRpcProvider } from "ethers";
import { UserOperationMiddlewareCtx, UserOperationMiddlewareFn } from "userop";
import { OctoDefiContracts } from "../constants";
import { OpToJSON } from "userop/dist/utils";

export const simplePaymaster =
  (provider: JsonRpcProvider, context: any): UserOperationMiddlewareFn =>
  async (ctx: UserOperationMiddlewareCtx) => {
    const chainId = (await provider.getNetwork()).chainId;
    if (!(Number(chainId) in OctoDefiContracts)) {
      throw new Error("Paymaster is not specified for the network");
    }
    ctx.op.paymasterAndData = OctoDefiContracts[Number(chainId)].Paymaster;

    console.log(ctx.op.paymasterAndData.length);

    ctx.op.verificationGasLimit = Number(ctx.op.verificationGasLimit) * 3;
    console.log(ctx.op);
    const est = await provider.send("eth_estimateUserOperationGas", [
      OpToJSON(ctx.op),
      ctx.entryPoint,
    ]);

    //TODO: Calculate PreverificationGas
    console.log(Number(est.preVerificationGas));

    ctx.op.preVerificationGas = 100_000;
    ctx.op.verificationGasLimit =
      est.verificationGasLimit ?? est.verificationGas;
    ctx.op.callGasLimit = est.callGasLimit;

    console.log(ctx.op);
  };
