/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  StrategyBuilderFacet,
  StrategyBuilderFacetInterface,
} from "../StrategyBuilderFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "functionCallData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct StrategyBuilderLib.Tactic[]",
        name: "tactics",
        type: "tuple[]",
      },
    ],
    name: "StrategyAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "StrategyRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "OnlyEntryPointOrFactoryAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "StrategyBuilderFacet__StrategyAlreadyActive",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "functionCallData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        internalType: "struct StrategyBuilderLib.Tactic[]",
        name: "tactics",
        type: "tuple[]",
      },
    ],
    name: "addStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
    ],
    name: "executeStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
    ],
    name: "getStrategy",
    outputs: [
      {
        components: [
          {
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "functionCallData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        internalType: "struct StrategyBuilderLib.Tactic[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
    ],
    name: "removeStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class StrategyBuilderFacet__factory {
  static readonly abi = _abi;
  static createInterface(): StrategyBuilderFacetInterface {
    return new Interface(_abi) as StrategyBuilderFacetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): StrategyBuilderFacet {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as StrategyBuilderFacet;
  }
}
