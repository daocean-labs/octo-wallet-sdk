import { JsonRpcProvider, ethers } from "ethers";
import { BundlerJsonRpcProvider, UserOperationMiddlewareFn } from "userop";


const eip1559GasPrice = async (provider: BundlerJsonRpcProvider) => {
    const [fee, block] = await Promise.all([
        provider.send("eth_maxPriorityFeePerGas", []),
        provider.getBlock("latest"),
    ]);

    const tip = BigInt(fee)
    const buffer = tip / BigInt(100) * BigInt(13)
    const maxPriorityFeePerGas = tip + buffer
    const maxFeePerGas = block?.baseFeePerGas ? BigInt(block.baseFeePerGas.toString()) * BigInt(2) + maxPriorityFeePerGas : maxPriorityFeePerGas

    return { maxFeePerGas, maxPriorityFeePerGas }
};


export const getGasPrice = (provider: BundlerJsonRpcProvider): UserOperationMiddlewareFn => async (ctx) => {
    let eip1559Error
    try {
        const { maxFeePerGas, maxPriorityFeePerGas } = await eip1559GasPrice(provider)

        ctx.op.maxFeePerGas = maxFeePerGas
        ctx.op.maxPriorityFeePerGas = maxPriorityFeePerGas
    } catch (error: any) {
        eip1559Error = error;
        console.warn(
            "getGas: eth_maxPriorityFeePerGas failed, falling back to legacy gas price."
        );
    }


}
