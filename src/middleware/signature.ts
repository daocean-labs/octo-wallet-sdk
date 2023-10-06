import { ethers, getBytes } from "ethers";
import { UserOperationMiddlewareFn } from "userop";


export const EOASignature = (signer: ethers.Signer): UserOperationMiddlewareFn => async (ctx) => {
    ctx.op.signature = await signer.signMessage(
        getBytes(ctx.getUserOpHash())
    );
}