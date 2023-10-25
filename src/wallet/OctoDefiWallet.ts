import {
  ethers,
  BytesLike,
  ZeroAddress,
  JsonRpcProvider,
  isAddress,
} from "ethers";
import { OctoDefiWalletUserOpBuilder } from "../builder";
import {
  SmartStrategyWallet,
  SmartStrategyWallet__factory,
  StrategyBuilder,
  StrategyBuilder__factory,
} from "../typechain";
import { Client, IClientOpts } from "userop";
import { OctoDefiContracts } from "../constants";
import { Tacticts } from "../constants/tacticts";
import { convertIntoBytes } from "../utils/convert";

export class OctoDefiWallet {
  private walletAddress: string;
  private bundlerRpcUrl: string;
  private signer: ethers.Signer;
  private builder: OctoDefiWalletUserOpBuilder | undefined;
  private walletContract: SmartStrategyWallet;
  private publicProvider: JsonRpcProvider;
  private strategyBuilder: StrategyBuilder;

  private constructor(
    signer: ethers.Signer,
    rpcUrl: string,
    bundlerRpcUrl: string
  ) {
    this.signer = signer;
    this.walletAddress = "0x";
    this.walletContract = SmartStrategyWallet__factory.connect(ZeroAddress);
    this.strategyBuilder = StrategyBuilder__factory.connect(ZeroAddress);
    this.publicProvider = new JsonRpcProvider(rpcUrl);
    this.bundlerRpcUrl = bundlerRpcUrl;
  }

  public static async init(
    signer: ethers.Signer,
    bundlerRpcUrl: string,
    rpcUrl: string,
    factoryAddress: string,
    strategyBuilderAddress: string
  ): Promise<OctoDefiWallet> {
    const instance = new OctoDefiWallet(signer, rpcUrl, bundlerRpcUrl);

    instance.builder = await OctoDefiWalletUserOpBuilder.init(
      signer,
      bundlerRpcUrl,
      factoryAddress,
      strategyBuilderAddress
    );

    instance.walletAddress = instance.builder.getSender();
    instance.walletContract = instance.builder.proxy.connect(
      instance.publicProvider
    );

    instance.strategyBuilder = StrategyBuilder__factory.connect(
      strategyBuilderAddress,
      instance.publicProvider
    );

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
    return this.walletContract;
  }

  async getBundlerClient(opts?: IClientOpts): Promise<Client> {
    const client = await Client.init(this.bundlerRpcUrl);
    return client;
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

  /* ====== Wallet Interactions ======*/

  private async sendUserOp(
    builder: OctoDefiWalletUserOpBuilder
  ): Promise<string> {
    const client = await this.getBundlerClient();
    try {
      const res = await client.sendUserOperation(builder);
      const env = await res.wait();

      return env?.transactionHash ?? "";
    } catch (e) {
      console.error(e);
      return "";
    }
  }

  async addNewOwner(owner: string): Promise<string> {
    if (this.builder) {
      return await this.sendUserOp(this.builder.addOwner(owner));
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }

  async removeOwner(owner: string): Promise<string> {
    if (this.builder) {
      return await this.sendUserOp(this.builder.removeOwner(owner));
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }

  async transferNativeCoin(to: string, value: bigint): Promise<string> {
    if (this.builder) {
      if (!isAddress(to)) throw Error("TransferNativeCoin: No valid address!");
      return await this.sendUserOp(this.builder.execute(to, value, "0x"));
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }

  async execute(to: string, value: bigint, data: BytesLike): Promise<string> {
    if (this.builder) {
      return await this.sendUserOp(this.builder.execute(to, value, data));
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }

  async executeSwapTacticWithExactAmount(
    tokenA: string,
    tokenB: string,
    amountIn: bigint,
    routerAddress: string
  ): Promise<string> {
    const chainId = Number((await this.publicProvider.getNetwork()).chainId);

    if (chainId in OctoDefiContracts) {
      if (this.builder) {
        const tacticID = Tacticts[chainId].Swap;
        const info = await this.strategyBuilder.getTacticFunction(tacticID);
        const inputs: BytesLike[] = [];

        inputs.push(convertIntoBytes(tokenA));
        inputs.push(convertIntoBytes(tokenB));
        inputs.push(convertIntoBytes(amountIn));
        inputs.push(convertIntoBytes(routerAddress));

        console.log(inputs);

        return await this.sendUserOp(
          this.builder.executeTactic(info[2], info[0], inputs)
        );
      } else {
        throw Error("UserOperationBuilder not initialized!");
      }
    } else {
      throw new Error("OctoDefiWallet: No valid network!");
    }
  }
}
