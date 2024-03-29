import {
  ZeroAddress,
  ethers,
  Wallet,
  getBytes,
  keccak256,
  JsonRpcProvider,
} from "ethers";
import {
  BundlerJsonRpcProvider,
  IPresetBuilderOpts,
  UserOperationBuilder,
  UserOperationMiddlewareFn,
} from "userop";
import { ERC4337 } from "userop/dist/constants";
import { EntryPoint, EntryPoint__factory } from "../typechain";
import { OctoWalletFactory, OctoWalletFactory__factory } from "../typechain";
import {
  EOASignature,
  estimateUserOperationGas,
  getGasPrice,
} from "../middleware";
import { hexConcat } from "@ethersproject/bytes";

const DEFAULT_PRIVATE_KEY =
  "0x0123456789012345678901234567890123456789012345678901234567890123"; // Replace with your private key
const DEFAULT_WALLET = new Wallet(DEFAULT_PRIVATE_KEY);

interface IWalletUserOpBuilderOpts extends IPresetBuilderOpts {
  walletAddress?: string;
}

export class WalletUserOpBuilder extends UserOperationBuilder {
  private signer: ethers.Signer;
  private entryPoint: EntryPoint;
  private factory: OctoWalletFactory;
  private initCode: string;
  private walletAddress: string;
  private bundler: BundlerJsonRpcProvider;
  private publicProvider: JsonRpcProvider;

  private constructor(
    signer: ethers.Signer,
    bundler: BundlerJsonRpcProvider,
    publicProvider: JsonRpcProvider,
    factoryAddress: string,
    opts?: IWalletUserOpBuilderOpts
  ) {
    super();

    this.initCode = "0x";
    this.walletAddress = ZeroAddress;

    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      publicProvider
    );

    this.bundler = bundler;
    this.publicProvider = publicProvider;
    this.signer = signer;

    this.factory = OctoWalletFactory__factory.connect(factoryAddress);
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0);
    ctx.op.initCode = ctx.op.nonce == BigInt(0) ? this.initCode : "0x";
  };

  public static async init(
    signer: ethers.Signer,
    bundler: BundlerJsonRpcProvider,
    publicProvider: JsonRpcProvider,
    factoryAddress: string,
    opts?: IWalletUserOpBuilderOpts
  ) {
    const instance = new WalletUserOpBuilder(
      signer,
      bundler,
      publicProvider,
      factoryAddress,
      opts
    );

    if (opts?.walletAddress) {
      instance.walletAddress = opts.walletAddress;
    } else {
      try {
        instance.initCode = hexConcat([
          await instance.factory.getAddress(),
          instance.factory.interface.encodeFunctionData("createWallet", [
            await instance.signer.getAddress(),
            opts?.salt ? opts.salt.toString() : BigInt(0),
          ]),
        ]);

        await instance.entryPoint
          .getFunction("getSenderAddress")
          .staticCall(instance.initCode);

        throw new Error("getSenderAddress: unexpected result");
      } catch (error: any) {
        let addr: string = "";
        if (error?.revert?.args) {
          addr = error.revert.args[0];
        } else {
          const senderError = instance.entryPoint.interface.getError(
            "SenderAddressResult"
          );
          if (senderError) {
            addr = instance.entryPoint.interface.decodeErrorResult(
              "SenderAddressResult",
              error.info.error.data
            )[0];
            if (!addr) throw error;
          }
        }
        instance.walletAddress = addr;
      }
    }

    const base = instance
      .useDefaults({
        sender: instance.walletAddress,
        signature: await DEFAULT_WALLET.signMessage(
          getBytes(keccak256("0xdead"))
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.publicProvider));
    // .useMiddleware(estimateUserOperationGas(instance.bundler));

    //TODO: Implement PaymasterMiddleware
    const withPM = opts?.paymasterMiddleware
      ? base.useMiddleware(opts.paymasterMiddleware)
      : base.useMiddleware(estimateUserOperationGas(instance.bundler));

    return withPM.useMiddleware(EOASignature(instance.signer));
  }
}
