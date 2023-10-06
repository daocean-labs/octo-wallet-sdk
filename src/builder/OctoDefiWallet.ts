import { ZeroAddress, ethers, getBytes, keccak256, BytesLike } from "ethers";
import {
  BundlerJsonRpcProvider,
  IPresetBuilderOpts,
  UserOperationBuilder,
  UserOperationMiddlewareFn,
} from "userop";
import { EntryPoint, EntryPoint__factory } from "userop/dist/typechain";
import {
  SmartStrategyWalletFactory,
  SmartStrategyWalletFactory__factory,
  SmartStrategyWallet as SmartStrategyWalletImpl,
  SmartStrategyWallet__factory,
} from "../typechain";
import { ERC4337 } from "userop/dist/constants";
import { hexConcat } from "@ethersproject/bytes";
import { EOASignature } from "../middleware/signature";
import { getGasPrice } from "../middleware/gasPrice";
import { estimateUserOperationGas } from "../middleware/gasLimit";

export class OctoDefiWallet extends UserOperationBuilder {
  private provider: BundlerJsonRpcProvider;
  private entryPoint: EntryPoint;
  private factory: SmartStrategyWalletFactory;
  private signer: ethers.Signer;
  private initCode: string;

  proxy: SmartStrategyWalletImpl;

  private constructor(
    signer: ethers.Signer,
    rpcURL: string,
    factoryAddress: string,
    owners?: string[],
    opts?: IPresetBuilderOpts
  ) {
    super();
    this.signer = signer;
    this.provider = new BundlerJsonRpcProvider(rpcURL).setBundlerRpc(
      opts?.overrideBundlerRpc
    );
    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      this.provider
    );
    this.factory = SmartStrategyWalletFactory__factory.connect(factoryAddress);
    this.initCode = "0x";
    this.proxy = SmartStrategyWallet__factory.connect(ZeroAddress);
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0);
    ctx.op.initCode = ctx.op.nonce.eq(0) ? this.initCode : "0x";
  };

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    factoryAddress: string,
    owners?: string[],
    opts?: IPresetBuilderOpts
  ): Promise<OctoDefiWallet> {
    const instance = new OctoDefiWallet(
      signer,
      rpcUrl,
      factoryAddress,
      owners,
      opts
    );

    try {
      instance.initCode = hexConcat([
        await instance.factory.getAddress(),
        instance.factory.interface.encodeFunctionData("createAccount", [
          await instance.signer.getAddress(),
          opts?.salt ? opts.salt.toString() : BigInt(0),
        ]),
      ]);

      await instance.entryPoint.callStatic.getSenderAddress(instance.initCode);

      throw new Error("getSenderAddress: unexpected result");
    } catch (error: any) {
      const addr = error?.errorArgs?.sender;
      if (!addr) throw error;

      instance.proxy = SmartStrategyWallet__factory.connect(addr);
    }

    const base = instance
      .useDefaults({
        sender: await instance.proxy.getAddress(),
        signature: await instance.signer.signMessage(
          getBytes(keccak256("0xdead"))
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.provider))
      .useMiddleware(estimateUserOperationGas(instance.provider));

    //TODO: Implement PaymasterMiddleware
    // const withPM = opts?.paymasterMiddleware
    //     ? base.useMiddleware(opts.paymasterMiddleware)
    //     : base.useMiddleware(estimateUserOperationGas(instance.provider));

    return base.useMiddleware(EOASignature(instance.signer));
  }

  execute(to: string, value: bigint, data: BytesLike) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("execute", [to, value, data])
    );
  }

  executeBatch(
    to: Array<string>,
    value: Array<bigint>,
    data: Array<BytesLike>
  ) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("executeBatch", [to, value, data])
    );
  }
}
