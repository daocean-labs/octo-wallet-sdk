import { ethers, BytesLike, ZeroAddress } from "ethers";
import { OctoDefiWalletUserOpBuilder } from "../builder";
import {
  SmartStrategyWallet,
  SmartStrategyWallet__factory,
} from "../typechain";
import { Client } from "userop";

export class OctoDefiWallet {
  private walletAddress: string;
  private signer: ethers.Signer;
  private builder: OctoDefiWalletUserOpBuilder | undefined;
  private walletContract: SmartStrategyWallet;

  private constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.walletAddress = "0x";
    this.walletContract = SmartStrategyWallet__factory.connect(ZeroAddress);
  }

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    factoryAddress: string,
    strategyBuilderAddress: string
  ): Promise<OctoDefiWallet> {
    const instance = new OctoDefiWallet(signer);

    instance.builder = await OctoDefiWalletUserOpBuilder.init(
      signer,
      rpcUrl,
      factoryAddress,
      strategyBuilderAddress
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

  async getStorageSlots(
    strategyID: bigint,
    tactics: Array<string>,
    numArgs: Array<number>
  ): Promise<Array<BytesLike>> {
    const storageSlots: Array<BytesLike> = [];

    for (let i = 0; i < tactics.length; i++) {
      for (let j = 0; j < numArgs[i]; j++) {
        const storage = await this.builder?.proxy.getStorageSlot(
          tactics[i],
          j,
          strategyID,
          i
        );
        if (storage) {
          storageSlots.push(storage);
        }
      }
    }

    return storageSlots;
  }
}
