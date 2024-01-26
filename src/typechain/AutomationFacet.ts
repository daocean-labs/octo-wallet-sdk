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

export declare namespace AutomationLib {
  export type AutomationStruct = {
    strategyId: BigNumberish;
    automationTriggerAddress: AddressLike;
  };

  export type AutomationStructOutput = [
    strategyId: bigint,
    automationTriggerAddress: string
  ] & { strategyId: bigint; automationTriggerAddress: string };
}

export interface AutomationFacetInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "VERSION"
      | "activateAutomation"
      | "deleteAutomation"
      | "executeAutomation"
      | "getAutomation"
      | "getRegistry"
      | "getRegistryId"
      | "validate"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "VERSION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "activateAutomation",
    values: [BigNumberish, BigNumberish, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteAutomation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "executeAutomation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAutomation",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistryId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "validate", values: [BytesLike]): string;

  decodeFunctionResult(functionFragment: "VERSION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "activateAutomation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteAutomation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeAutomation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAutomation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistryId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "validate", data: BytesLike): Result;
}

export interface AutomationFacet extends BaseContract {
  connect(runner?: ContractRunner | null): AutomationFacet;
  waitForDeployment(): Promise<this>;

  interface: AutomationFacetInterface;

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

  VERSION: TypedContractMethod<[], [string], "view">;

  activateAutomation: TypedContractMethod<
    [
      automationId: BigNumberish,
      strategyId: BigNumberish,
      triggerId: BigNumberish,
      triggerAddress: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  deleteAutomation: TypedContractMethod<
    [automationId: BigNumberish],
    [void],
    "nonpayable"
  >;

  executeAutomation: TypedContractMethod<
    [automationId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getAutomation: TypedContractMethod<
    [automationId: BigNumberish],
    [AutomationLib.AutomationStructOutput],
    "view"
  >;

  getRegistry: TypedContractMethod<[], [string], "view">;

  getRegistryId: TypedContractMethod<
    [automationId: BigNumberish],
    [bigint],
    "view"
  >;

  validate: TypedContractMethod<[data: BytesLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "VERSION"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "activateAutomation"
  ): TypedContractMethod<
    [
      automationId: BigNumberish,
      strategyId: BigNumberish,
      triggerId: BigNumberish,
      triggerAddress: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deleteAutomation"
  ): TypedContractMethod<[automationId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "executeAutomation"
  ): TypedContractMethod<[automationId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getAutomation"
  ): TypedContractMethod<
    [automationId: BigNumberish],
    [AutomationLib.AutomationStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getRegistryId"
  ): TypedContractMethod<[automationId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "validate"
  ): TypedContractMethod<[data: BytesLike], [bigint], "view">;

  filters: {};
}
