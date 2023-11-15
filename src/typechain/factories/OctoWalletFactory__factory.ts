/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  OctoWalletFactory,
  OctoWalletFactoryInterface,
} from "../OctoWalletFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "octoWalletInit",
        type: "address",
      },
      {
        internalType: "address",
        name: "entryPoint",
        type: "address",
      },
      {
        internalType: "address",
        name: "diamondCutFacet",
        type: "address",
      },
      {
        internalType: "address",
        name: "diamondLoupeFacet",
        type: "address",
      },
      {
        internalType: "address",
        name: "ownershipFacet",
        type: "address",
      },
      {
        internalType: "address",
        name: "smartContractWalletFacet",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "WalletCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "walletOwner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "salt",
        type: "uint256",
      },
    ],
    name: "createWallet",
    outputs: [
      {
        internalType: "contract OctoWallet",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCoreFacetCuts",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "enum IDiamond.FacetCutAction",
            name: "action",
            type: "uint8",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamond.FacetCut[]",
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
        internalType: "address",
        name: "walletOwner",
        type: "address",
      },
    ],
    name: "getOctoWalletArgs",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "entryPoint",
            type: "address",
          },
          {
            internalType: "address",
            name: "walletFactory",
            type: "address",
          },
          {
            internalType: "address",
            name: "init",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "initCalldata",
            type: "bytes",
          },
        ],
        internalType: "struct OctoWalletArgs",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "walletOwner",
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
] as const;

export class OctoWalletFactory__factory {
  static readonly abi = _abi;
  static createInterface(): OctoWalletFactoryInterface {
    return new Interface(_abi) as OctoWalletFactoryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): OctoWalletFactory {
    return new Contract(address, _abi, runner) as unknown as OctoWalletFactory;
  }
}
