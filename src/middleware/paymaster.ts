import { JsonRpcProvider, JsonRpcSigner, Wallet } from "ethers";
import { UserOperationMiddlewareCtx, UserOperationMiddlewareFn } from "userop";
import { OctoDefiContracts } from "../constants";

export const verifyingPaymaster =
  (provider: JsonRpcProvider, context: any): UserOperationMiddlewareFn =>
  async (ctx: UserOperationMiddlewareCtx) => {
    const now = Date.now();

    const validUntil = now / 1000 + 5 * 60;

    const validAfter = now / 1000;

    const signer = new Wallet(
      "2f3ab58e83d1acd961ada8ee6cb996e8ab0ddbd61c3afd07b015d7c0898480c5",
      provider
    );
  };
