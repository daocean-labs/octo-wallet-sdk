import {
  ethers,
  BytesLike,
  ZeroAddress,
  JsonRpcProvider,
  isAddress,
  AddressLike,
} from "ethers";
import { OctoDefiWalletUserOpBuilder } from "../builder";
import {
  IERC20Metadata__factory,
  SmartStrategyWallet,
  SmartStrategyWallet__factory,
  StrategyBuilder,
  StrategyBuilder__factory,
} from "../typechain";
import { Client, IClientOpts } from "userop";
import { OctoDefiContracts } from "../constants";
import { Tacticts } from "../constants/tacticts";
import { convertArrayIntoBytesArray, convertIntoBytes } from "../utils/convert";

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

  async getStorageSlot(
    libAddress: AddressLike,
    argumentPosition: bigint,
    strategyID: bigint,
    tacticPosition: bigint
  ): Promise<BytesLike> {
    if (!this.builder) {
      throw Error("OctoDefiWallet: Wallet not initialized!");
    }
    return await this.walletContract.getStorageSlot(
      libAddress,
      argumentPosition,
      strategyID,
      tacticPosition
    );
  }

  async getValue(storageSlot: BytesLike): Promise<BytesLike> {
    if (!this.builder) {
      throw Error("OctoDefiWallet: Wallet not initialized!");
    }
    return await this.walletContract.getValue(storageSlot);
  }

  async getStrategy(strategyID: bigint): Promise<BytesLike> {
    const strategy = await this.walletContract.getStrategy(strategyID);

    if (!strategy) throw new Error("No existing strategy with the ID");

    return strategy;
  }

  /* ====== Wallet Interactions ======*/

  private async sendUserOp(
    builder: OctoDefiWalletUserOpBuilder
  ): Promise<string> {
    const client = await this.getBundlerClient();
    try {
      console.log(builder.getOp());
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

  async transferERC20Token(
    tokenAddress: string,
    to: string,
    amount: bigint
  ): Promise<string> {
    if (this.builder) {
      if (!isAddress(to)) throw Error("TransferNativeCoin: No valid address!");
      const token = IERC20Metadata__factory.connect(ZeroAddress);
      const functionCalldata = token.interface.encodeFunctionData("transfer", [
        to,
        amount,
      ]);
      return await this.sendUserOp(
        this.builder.execute(tokenAddress, BigInt(0), functionCalldata)
      );
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

  async setStrategy(
    strategyID: bigint,
    tactics: Array<BytesLike>
  ): Promise<string> {
    if (this.builder) {
      return await this.sendUserOp(
        this.builder.setStrategy(strategyID, tactics)
      );
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }

  async setStrategyWithFunctionArgs(
    strategyID: bigint,
    tactics: Array<BytesLike>,
    inputs: Array<any>
  ) {
    if (this.builder) {
      const inputsByte = convertArrayIntoBytesArray(inputs);
      const slots: BytesLike[] = [];

      let tacticNo = 0;
      let i = 0;
      while (i < inputs.length) {
        const tacticInfo = await this.strategyBuilder.getTacticFunction(
          tactics[tacticNo]
        );

        for (let j = 0; j < tacticInfo[1]; j++) {
          const slot = await this.getStorageSlot(
            tacticInfo[2],
            BigInt(j),
            strategyID,
            BigInt(tacticNo)
          );

          slots.push(slot);
          i++;
        }
        tacticNo++;
      }

      return this.sendUserOp(
        this.builder.setStrategyWithArguments(
          strategyID,
          tactics,
          slots,
          inputsByte
        )
      );
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }

  async executeStrategy(strategyID: bigint): Promise<string> {
    if (this.builder) {
      const strategy = await this.walletContract.getStrategy(strategyID);
      if (strategy.length === 0)
        throw Error("StrategyExecution: No Active Strategy");
      return this.sendUserOp(this.builder.executeStrategy(strategyID));
    } else {
      throw Error("UserOperationBuilder not initialized!");
    }
  }
}
