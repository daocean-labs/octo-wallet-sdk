import { BytesLike, JsonRpcProvider, ZeroAddress, ethers } from "ethers";
import { BundlerJsonRpcProvider, Client, UserOperationBuilder } from "userop";
import {
  DiamondLoupeFacet,
  DiamondLoupeFacet__factory,
  SmartContractWalletFacet__factory,
} from "../typechain";
import { DiamondWalletUserOpBuilder } from "../builder";
import { ChainID, DiamondWalletContracts } from "../constants";
import { UserOperationEventEvent } from "userop/dist/typechain/EntryPoint";

export class DiamondWallet {
  private walletAddress: string;
  private signer: ethers.Signer;
  private publicProvider: JsonRpcProvider;
  private userOPBuilder: DiamondWalletUserOpBuilder | null;
  private client: Client | null;
  private functions: Array<BytesLike>;
  private facets: Array<string>;
  private diamondLoupe: DiamondLoupeFacet;

  private constructor(signer: ethers.Signer, publicRpcUrl: string) {
    this.publicProvider = new JsonRpcProvider(publicRpcUrl);

    this.signer = signer;
    this.walletAddress = ZeroAddress;
    this.userOPBuilder = null;
    this.client = null;
    this.functions = [];
    this.facets = [];
    this.diamondLoupe = DiamondLoupeFacet__factory.connect(ZeroAddress);
  }

  public static async init(
    signer: ethers.Signer,
    bundlerRpcUrl: string,
    rpcUrl: string,
    salt?: bigint
  ) {
    const instance = new DiamondWallet(signer, rpcUrl);

    const bundler = new BundlerJsonRpcProvider(bundlerRpcUrl);

    const chainId = (await instance.publicProvider.getNetwork()).chainId;

    const contracts = DiamondWalletContracts[Number(chainId)];
    console.log(chainId);
    console.log(contracts);

    let entryPoint;

    entryPoint = contracts.EntryPoint;

    instance.userOPBuilder = await DiamondWalletUserOpBuilder.init(
      signer,
      bundler,
      contracts.Factory,
      { entryPoint: entryPoint }
    );

    instance.walletAddress = instance.userOPBuilder.getSender();
    instance.diamondLoupe = DiamondLoupeFacet__factory.connect(
      instance.walletAddress,
      instance.publicProvider
    );

    instance.client = await Client.init(bundlerRpcUrl);

    // const facets = await instance.diamondLoupe.facets();
    // console.log(facets);
    // facets.forEach((facet) => {
    //   instance.facets.push(facet.facetAddress);
    //   const selectors = facet.functionSelectors;
    //   selectors.map((selector) => {
    //     instance.functions.push(selector);
    //   });
    // });

    return instance;
  }

  /* ====== Getter Functions ====== */
  getWalletAddress(): string {
    return this.walletAddress;
  }

  getUserOpBuilder(): DiamondWalletUserOpBuilder | null {
    if (!this.userOPBuilder) return null;
    return this.userOPBuilder;
  }

  getClient(): Client | null {
    if (!this.client) return null;
    return this.client;
  }

  getFacetAddresses(): Array<string> {
    return this.facets;
  }

  getFunctions(): Array<BytesLike> {
    return this.functions;
  }

  /* ====== Wallet Interactions ======*/

  private async sendUserOp(
    builder: DiamondWalletUserOpBuilder
  ): Promise<UserOperationEventEvent | null> {
    if (!this.client) throw Error("No Client initialized!");
    try {
      console.log(builder.getOp());
      const res = await this.client.sendUserOperation(builder);
      const env = await res.wait();

      return env;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /* ====== Core Facet Interactions ====== */

  async execute(
    to: string,
    value: bigint,
    data: BytesLike
  ): Promise<UserOperationEventEvent | null> {
    if (!this.userOPBuilder)
      throw Error("UserOpertaionBuilder not initialized!");
    const intrf = SmartContractWalletFacet__factory.connect(this.walletAddress);
    const functionCallData = intrf.interface.encodeFunctionData("execute", [
      to,
      value,
      data,
    ]);

    return await this.sendUserOp(
      this.userOPBuilder.setCallData(functionCallData)
    );
  }
}
