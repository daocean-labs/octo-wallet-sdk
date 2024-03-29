/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  AutomationInit,
  AutomationInitInterface,
} from "../AutomationInit";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "registry",
        type: "address",
      },
      {
        internalType: "bytes4[]",
        name: "viewFunctionSelectors",
        type: "bytes4[]",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class AutomationInit__factory {
  static readonly abi = _abi;
  static createInterface(): AutomationInitInterface {
    return new Interface(_abi) as AutomationInitInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AutomationInit {
    return new Contract(address, _abi, runner) as unknown as AutomationInit;
  }
}
