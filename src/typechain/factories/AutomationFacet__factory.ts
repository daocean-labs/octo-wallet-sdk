/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  AutomationFacet,
  AutomationFacetInterface,
} from "../AutomationFacet";

const _abi = [
  {
    inputs: [],
    name: "Automation__NoActiveAutomation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "triggerAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "triggerId",
        type: "uint256",
      },
    ],
    name: "Automation__NoActiveTrigger",
    type: "error",
  },
  {
    inputs: [],
    name: "Automation__NoRegistrySet",
    type: "error",
  },
  {
    inputs: [],
    name: "Automation__NoValidCallData",
    type: "error",
  },
  {
    inputs: [],
    name: "Automation__NoValidExecution",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "strategyId",
        type: "uint16",
      },
    ],
    name: "Automation__NotActiveStrategy",
    type: "error",
  },
  {
    inputs: [],
    name: "Automation__NotTheCorrectFunctionSelector",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "triggerAddress",
        type: "address",
      },
    ],
    name: "Automation__TriggerContractIsNotValid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "condition",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "id",
        type: "uint16",
      },
    ],
    name: "StrategyBuilderFacet__ConditionReverted",
    type: "error",
  },
  {
    inputs: [],
    name: "StrategyBuilderFacet__StrategyAlreadyActive",
    type: "error",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "automationId",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "strategyId",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "triggerId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "triggerAddress",
        type: "address",
      },
    ],
    name: "activateAutomation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "automationId",
        type: "uint256",
      },
    ],
    name: "deleteAutomation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "automationId",
        type: "uint256",
      },
    ],
    name: "executeAutomation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "automationId",
        type: "uint256",
      },
    ],
    name: "getAutomation",
    outputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "strategyId",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "automationTriggerAddress",
            type: "address",
          },
        ],
        internalType: "struct AutomationLib.Automation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegistry",
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
    inputs: [
      {
        internalType: "uint256",
        name: "automationId",
        type: "uint256",
      },
    ],
    name: "getRegistryId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "validate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class AutomationFacet__factory {
  static readonly abi = _abi;
  static createInterface(): AutomationFacetInterface {
    return new Interface(_abi) as AutomationFacetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AutomationFacet {
    return new Contract(address, _abi, runner) as unknown as AutomationFacet;
  }
}
