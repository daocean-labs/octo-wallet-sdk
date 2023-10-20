import {
  ZeroAddress,
  ethers,
  getBytes,
  keccak256,
  BytesLike,
  Wallet,
  isAddress,
  zeroPadBytes,
  JsonRpcProvider,
} from "ethers";
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

const DEFAULT_PRIVATE_KEY =
  "0x0123456789012345678901234567890123456789012345678901234567890123"; // Replace with your private key
const DEFAULT_WALLET = new Wallet(DEFAULT_PRIVATE_KEY);

export class OctoDefiWalletUserOpBuilder extends UserOperationBuilder {
  private provider: BundlerJsonRpcProvider;
  private entryPoint: EntryPoint;
  private factory: SmartStrategyWalletFactory;
  private signer: ethers.Signer;
  private initCode: string;
  private strategyBuilderAddress: string;

  proxy: SmartStrategyWalletImpl;

  private constructor(
    signer: ethers.Signer,
    rpcURL: string,
    factoryAddress: string,
    strategyBuilderAddress: string,
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
    this.strategyBuilderAddress = strategyBuilderAddress;
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0);
    ctx.op.initCode = ctx.op.nonce.eq(0) ? this.initCode : "0x";
  };

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    factoryAddress: string,
    strategyBuilderAddress: string,
    opts?: IPresetBuilderOpts
  ): Promise<OctoDefiWalletUserOpBuilder> {
    const instance = new OctoDefiWalletUserOpBuilder(
      signer,
      rpcUrl,
      factoryAddress,
      strategyBuilderAddress,
      opts
    );

    try {
      instance.initCode = hexConcat([
        await instance.factory.getAddress(),
        instance.factory.interface.encodeFunctionData("createAccount", [
          await instance.signer.getAddress(),
          strategyBuilderAddress,
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
        signature: await DEFAULT_WALLET.signMessage(
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

  addOwner(newOwner: string) {
    if (isAddress(newOwner)) {
      return this.setCallData(
        this.proxy.interface.encodeFunctionData("addOwner", [newOwner])
      );
    } else {
      throw Error("OctoDefiWalletUserOpBuilder: No valid string!");
    }
  }

  removeOwner(owner: string) {
    if (isAddress(owner)) {
      return this.setCallData(
        this.proxy.interface.encodeFunctionData("removeOwner", [owner])
      );
    } else {
      throw Error("OctoDefiWalletUserOpBuilder: No valid string!");
    }
  }

  setNewStrategyBuilder(strategyBuilder: string) {
    if (isAddress(strategyBuilder)) {
      return this.setCallData(
        this.proxy.interface.encodeFunctionData("setStrategyBuilder", [
          strategyBuilder,
        ])
      );
    }
  }

  setStrategy(strategyID: bigint, tactics: Array<BytesLike>) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("setStrategy", [
        tactics,
        strategyID,
      ])
    );
  }
}
