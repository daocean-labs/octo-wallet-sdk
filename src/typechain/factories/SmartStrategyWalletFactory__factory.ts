/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  SmartStrategyWalletFactory,
  SmartStrategyWalletFactoryInterface,
} from "../SmartStrategyWalletFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "entryPoint",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "strategyBuilder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "createAccount",
    outputs: [
      {
        internalType: "contract SmartStrategyWallet",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "strategyBuilder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "getWalletAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWalletImplementation",
    outputs: [
      {
        internalType: "contract SmartStrategyWallet",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class SmartStrategyWalletFactory__factory {
  static readonly abi = _abi;
  static createInterface(): SmartStrategyWalletFactoryInterface {
    return new Interface(_abi) as SmartStrategyWalletFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SmartStrategyWalletFactory {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as SmartStrategyWalletFactory;
  }
}
