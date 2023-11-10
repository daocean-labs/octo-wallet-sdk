import { ZeroAddress, ethers, Wallet, getBytes, keccak256 } from "ethers";
import {
  BundlerJsonRpcProvider,
  IPresetBuilderOpts,
  UserOperationBuilder,
  UserOperationMiddlewareFn,
} from "userop";
import { ERC4337 } from "userop/dist/constants";
import { EntryPoint, EntryPoint__factory } from "userop/dist/typechain";
import {
  DiamondWalletFactory,
  DiamondWalletFactory__factory,
} from "../typechain";
import {
  EOASignature,
  estimateUserOperationGas,
  getGasPrice,
} from "../middleware";
import { hexConcat } from "@ethersproject/bytes";

const DEFAULT_PRIVATE_KEY =
  "0x0123456789012345678901234567890123456789012345678901234567890123"; // Replace with your private key
const DEFAULT_WALLET = new Wallet(DEFAULT_PRIVATE_KEY);

export class DiamondWalletUserOpBuilder extends UserOperationBuilder {
  private signer: ethers.Signer;
  private entryPoint: EntryPoint;
  private factory: DiamondWalletFactory;
  private initCode: string;
  private walletAddress: string;
  private bundler: BundlerJsonRpcProvider;

  private constructor(
    signer: ethers.Signer,
    bundler: BundlerJsonRpcProvider,
    factoryAddress: string,
    opts?: IPresetBuilderOpts
  ) {
    super();

    this.initCode = "0x";
    this.walletAddress = ZeroAddress;

    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      bundler
    );

    this.bundler = bundler;
    this.signer = signer;
    console.log(factoryAddress);
    this.factory = DiamondWalletFactory__factory.connect(factoryAddress);
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0);
    ctx.op.initCode = ctx.op.nonce.eq(0) ? this.initCode : "0x";
  };

  public static async init(
    signer: ethers.Signer,
    bundler: BundlerJsonRpcProvider,
    factoryAddress: string,
    opts?: IPresetBuilderOpts
  ) {
    const instance = new DiamondWalletUserOpBuilder(
      signer,
      bundler,
      factoryAddress,
      opts
    );

    try {
      instance.initCode = hexConcat([
        await instance.factory.getAddress(),
        instance.factory.interface.encodeFunctionData("createDiamondWallet", [
          await instance.signer.getAddress(),
          opts?.salt ? opts.salt.toString() : BigInt(0),
        ]),
      ]);

      await instance.entryPoint.callStatic.getSenderAddress(instance.initCode);

      throw new Error("getSenderAddress: unexpected result");
    } catch (error: any) {
      const addr = error?.errorArgs?.sender;
      if (!addr) throw error;

      instance.walletAddress = addr;
    }

    console.log(instance.initCode);
    const base = instance
      .useDefaults({
        sender: instance.walletAddress,
        signature: await DEFAULT_WALLET.signMessage(
          getBytes(keccak256("0xdead"))
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.bundler))
      .useMiddleware(estimateUserOperationGas(instance.bundler));

    //TODO: Implement PaymasterMiddleware
    // const withPM = opts?.paymasterMiddleware
    //     ? base.useMiddleware(opts.paymasterMiddleware)
    //     : base.useMiddleware(estimateUserOperationGas(instance.provider));

    return base.useMiddleware(EOASignature(instance.signer));
  }
}
