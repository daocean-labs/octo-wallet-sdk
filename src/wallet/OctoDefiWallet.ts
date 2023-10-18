import { ethers } from "ethers";
import { OctoDefiWalletUserOpBuilder } from "../builder";
import { SmartStrategyWallet } from "../typechain";

export class OctoDefiWallet {
  private walletAddress: string;
  private signer: ethers.Signer;
  private builder: OctoDefiWalletUserOpBuilder | undefined;

  private constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.walletAddress = "0x";
  }

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    factoryAddress: string
  ): Promise<OctoDefiWallet> {
    const instance = new OctoDefiWallet(signer);

    instance.builder = await OctoDefiWalletUserOpBuilder.init(
      signer,
      rpcUrl,
      factoryAddress
    );

    instance.walletAddress = instance.builder.getSender();

    return instance;
  }

  /* ====== Getter Functions ====== */
  getWalletAddress(): string {
    return this.walletAddress;
  }

  getBuilder(): OctoDefiWalletUserOpBuilder {
    if (!this.builder) {
      throw Error("OctoDefiWallet: Wallet not initialized!");
    }
    return this.builder;
  }

  getActiveSigner(): ethers.Signer {
    return this.signer;
  }

  getWalletContract(): SmartStrategyWallet {
    if (!this.builder) {
      throw Error("OctoDefiWallet: Wallet not initialized!");
    }
    return this.builder.proxy;
  }
}
