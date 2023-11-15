import {
  BundlerJsonRpcProvider,
  IClientOpts,
  ISendUserOperationOpts,
  IUserOperationBuilder,
  UserOperationMiddlewareCtx,
} from "userop";
import { OpToJSON } from "userop/dist/utils";
import { EntryPoint, EntryPoint__factory } from "../typechain";
import { JsonRpcProvider, ZeroAddress } from "ethers";
import { ERC4337 } from "userop/dist/constants";

export interface ISendUserOperationResult {
  useropHash: string;
  sender: string;
  paymaster: string;
  nonce: bigint;
  success: boolean;
  actualGasCost: bigint;
  actualGasUsed: bigint;
  transactionHash: string;
}

export class OctoClient {
  private publicProvider: JsonRpcProvider;
  private bundler: BundlerJsonRpcProvider;

  public entryPoint: EntryPoint;
  private entryPointAddress: string;
  public chainId: bigint;
  public waitTimeoutMs: number;
  public waitIntervalMs: number;

  private constructor(rpcUrl: string, bundlerUrl: string, opts?: IClientOpts) {
    this.bundler = new BundlerJsonRpcProvider(bundlerUrl).setBundlerRpc(
      opts?.overrideBundlerRpc
    );

    this.publicProvider = new JsonRpcProvider(rpcUrl);

    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      this.publicProvider
    );

    this.entryPointAddress = ZeroAddress;

    this.chainId = BigInt(1);
    this.waitTimeoutMs = 30000;
    this.waitIntervalMs = 5000;
  }

  public static async init(
    rpcUrl: string,
    bundlerUrl: string,
    opts?: IClientOpts
  ) {
    const instance = new OctoClient(rpcUrl, bundlerUrl, opts);

    instance.chainId = (await instance.publicProvider.getNetwork()).chainId;
    instance.entryPointAddress = await instance.entryPoint.getAddress();

    return instance;
  }

  async buildUserOperation(builder: IUserOperationBuilder) {
    return builder.buildOp(this.entryPointAddress, this.chainId);
  }

  async sendUserOperation(
    builder: IUserOperationBuilder,
    opts?: ISendUserOperationOpts
  ) {
    const dryRun = Boolean(opts?.dryRun);
    const op = await this.buildUserOperation(builder);
    opts?.onBuild?.(op);

    const userOpHash = dryRun
      ? new UserOperationMiddlewareCtx(
          op,
          this.entryPointAddress,
          this.chainId
        ).getUserOpHash()
      : ((await this.bundler.send("eth_sendUserOperation", [
          OpToJSON(op),
          this.entryPointAddress,
        ])) as string);
    builder.resetOp();

    builder.resetOp();

    return {
      userOpHash,
      wait: async () => {
        if (dryRun) {
          return null;
        }

        const end = Date.now() + this.waitTimeoutMs;
        const block = await this.publicProvider.getBlock("latest");
        while (Date.now() < end) {
          const fromBlock = block?.number ? Math.max(0, block.number - 100) : 0;
          const events = await this.entryPoint.queryFilter(
            this.entryPoint.filters.UserOperationEvent(userOpHash),
            fromBlock
          );
          if (events.length > 0) {
            const res: ISendUserOperationResult = {
              useropHash: events[0].args.userOpHash,
              sender: events[0].args.sender,
              paymaster: events[0].args.paymaster,
              nonce: events[0].args.nonce,
              success: events[0].args.success,
              actualGasCost: events[0].args.actualGasCost,
              actualGasUsed: events[0].args.actualGasUsed,
              transactionHash: events[0].transactionHash,
            };

            return res;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, this.waitIntervalMs)
          );
        }

        return null;
      },
    };
  }
}
