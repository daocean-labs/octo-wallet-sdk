/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface SmartStrategyWalletFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createAccount"
      | "getWalletAddress"
      | "getWalletImplementation"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createAccount",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getWalletAddress",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getWalletImplementation",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "createAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWalletAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWalletImplementation",
    data: BytesLike
  ): Result;
}

export interface SmartStrategyWalletFactory extends BaseContract {
  connect(runner?: ContractRunner | null): SmartStrategyWalletFactory;
  waitForDeployment(): Promise<this>;

  interface: SmartStrategyWalletFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  createAccount: TypedContractMethod<
    [creator: AddressLike, salt: BigNumberish],
    [string],
    "nonpayable"
  >;

  getWalletAddress: TypedContractMethod<
    [creator: AddressLike, salt: BigNumberish],
    [string],
    "view"
  >;

  getWalletImplementation: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createAccount"
  ): TypedContractMethod<
    [creator: AddressLike, salt: BigNumberish],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getWalletAddress"
  ): TypedContractMethod<
    [creator: AddressLike, salt: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getWalletImplementation"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}
