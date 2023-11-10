import {
  BytesLike,
  JsonRpcProvider,
  ZeroAddress,
  ethers,
  isAddress,
} from "ethers";
import { BundlerJsonRpcProvider, Client } from "userop";
import {
  DiamondLoupeFacet__factory,
  SmartContractWalletFacet__factory,
  OwnershipFacet__factory,
  DiamondCutFacet__factory,
} from "../typechain";
import { DiamondWalletUserOpBuilder } from "../builder";
import { ChainID, DiamondWalletContracts } from "../constants";
import { UserOperationEventEvent } from "userop/dist/typechain/EntryPoint";
import { IDiamondLoupe } from "../typechain/DiamondLoupeFacet";
import { IDiamond } from "../typechain/DiamondCutFacet";

export interface IDiomandWalletOpts {
  walletAddress?: string;
  salt?: bigint;
}

export class DiamondWallet {
  private walletAddress: string;
  private signer: ethers.Signer;
  private publicProvider: JsonRpcProvider;
  private userOPBuilder: DiamondWalletUserOpBuilder;
  private client: Client;
  private functions: Array<BytesLike>;
  private isDeployed: boolean;

  private constructor(
    signer: ethers.Signer,
    publicProvider: JsonRpcProvider,
    client: Client,
    builder: DiamondWalletUserOpBuilder
  ) {
    this.publicProvider = publicProvider;

    this.signer = signer;
    this.walletAddress = ZeroAddress;
    this.userOPBuilder = builder;
    this.client = client;
    this.functions = [];
    this.isDeployed = false;
  }

  public static async init(
    signer: ethers.Signer,
    bundlerRpcUrl: string,
    rpcUrl: string,
    opts?: IDiomandWalletOpts
  ) {
    const publicProvider = new JsonRpcProvider(rpcUrl);

    const chainId = (await publicProvider.getNetwork()).chainId;

    const contracts = DiamondWalletContracts[Number(chainId)];

    const entryPoint = contracts.EntryPoint;
    const bundler = new BundlerJsonRpcProvider(bundlerRpcUrl);

    const builder = await DiamondWalletUserOpBuilder.init(
      signer,
      bundler,
      contracts.Factory,
      { entryPoint: entryPoint, salt: opts?.salt }
    );

    const client = await Client.init(bundlerRpcUrl);

    const instance = new DiamondWallet(signer, publicProvider, client, builder);

    instance.walletAddress = instance.userOPBuilder.getSender();

    instance.isDeployed = await instance.checkDeployment();

    return instance;
  }

  private async checkDeployment(): Promise<boolean> {
    const byteCode = await this.publicProvider.getCode(this.walletAddress);
    return byteCode.length != 0;
  }

  /* ====== Getter Functions ====== */
  getWalletAddress(): string {
    return this.walletAddress;
  }

  getUserOpBuilder(): DiamondWalletUserOpBuilder | null {
    return this.userOPBuilder;
  }

  getClient(): Client | null {
    return this.client;
  }

  getActiveSigner(): ethers.Signer {
    return this.signer;
  }

  getDeploymentStatus(): boolean {
    return this.isDeployed;
  }

  /* ======= Core Facet Getter Functions ====== */

  async getFacetAddresses(): Promise<Array<string>> {
    if (!this.isDeployed) throw Error("Diamond Wallet not deployed!!");
    return await DiamondLoupeFacet__factory.connect(
      this.walletAddress,
      this.publicProvider
    ).facetAddresses();
  }

  async getFacets(): Promise<Array<IDiamondLoupe.FacetStructOutput>> {
    if (!this.isDeployed) throw Error("Diamond Wallet not deployed!!");
    return await DiamondLoupeFacet__factory.connect(
      this.walletAddress,
      this.publicProvider
    ).facets();
  }

  async getWalletOwner(): Promise<string> {
    if (!this.isDeployed) throw Error("Diamond Wallet not deployed!!");
    return await OwnershipFacet__factory.connect(
      this.walletAddress,
      this.publicProvider
    ).owner();
  }

  /* ====== Wallet Interactions ======*/

  private async sendUserOp(
    builder: DiamondWalletUserOpBuilder
  ): Promise<UserOperationEventEvent | null> {
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
    dest: string,
    value: bigint,
    data: BytesLike
  ): Promise<UserOperationEventEvent | null> {
    if (!isAddress(dest))
      throw Error(`Destintation ${dest} is not a valid evm address`);
    const intrf = SmartContractWalletFacet__factory.connect(this.walletAddress);
    const functionCallData = intrf.interface.encodeFunctionData("execute", [
      dest,
      value,
      data,
    ]);

    return await this.sendUserOp(
      this.userOPBuilder.setCallData(functionCallData)
    );
  }

  async executeBatch(
    dests: Array<string>,
    values: Array<bigint>,
    datas: Array<BytesLike>
  ): Promise<UserOperationEventEvent | null> {
    dests.forEach((dest) => {
      if (!isAddress(dest))
        throw Error(`Destintation ${dest} is not a valid evm address`);
    });
    const intrf = SmartContractWalletFacet__factory.connect(this.walletAddress);
    const functionCallData = intrf.interface.encodeFunctionData(
      "executeBatch",
      [dests, values, datas]
    );
    return await this.sendUserOp(
      this.userOPBuilder.setCallData(functionCallData)
    );
  }

  async diamondCut(
    facetCuts: Array<IDiamond.FacetCutStruct>,
    init: string,
    initData: BytesLike
  ): Promise<UserOperationEventEvent | null> {
    if (!isAddress(init))
      throw Error(`Init ${init} is not a valid evm address`);

    const intrf = DiamondCutFacet__factory.connect(
      this.walletAddress
    ).interface;

    const functionCallData = intrf.encodeFunctionData("diamondCut", [
      facetCuts,
      init,
      initData,
    ]);

    return await this.sendUserOp(
      this.userOPBuilder.setCallData(functionCallData)
    );
  }

  async transferOwnership(
    newOwner: string
  ): Promise<UserOperationEventEvent | null> {
    if (!isAddress(newOwner))
      throw Error(`New owner ${newOwner} is not a valid evm address`);

    const intrf = OwnershipFacet__factory.connect(
      this.walletAddress,
      this.publicProvider
    ).interface;

    const functionCallData = intrf.encodeFunctionData("transferOwnership", [
      newOwner,
    ]);

    return await this.sendUserOp(
      this.userOPBuilder.setCallData(functionCallData)
    );
  }
}
