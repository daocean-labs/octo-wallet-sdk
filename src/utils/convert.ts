import {
  AbiCoder,
  BytesLike,
  keccak256,
  toUtf8Bytes,
  isAddress,
  ParamType,
  toQuantity,
  AddressLike,
  Result,
} from "ethers";
import { HexString } from "ethers/lib.commonjs/utils/data";

export enum InputTypes {
  ADDRESS = "address",
  STRING = "string",
  BOOLEAN = "bool",
  UINT256 = "uint256",
}

export function convertIntoBytes(
  input: string | AddressLike | bigint | number | boolean
): BytesLike {
  const abiCoder = AbiCoder.defaultAbiCoder();

  if (typeof input === "string" && isAddress(input)) {
    // If data is an Ethereum address, encode it as 'address' type
    return abiCoder.encode(["address"], [input]);
  } else if (typeof input === "bigint" || typeof input === "number") {
    // If data is a bigint or number, encode it as 'uint256' type
    return abiCoder.encode(["uint256"], [input]);
  } else if (typeof input === "string") {
    // If data is a string, encode it as 'string' type
    return abiCoder.encode(["string"], [input]);
  } else if (typeof input === "boolean") {
    // If data is a boolean, encode it as 'bool' type
    return abiCoder.encode(["bool"], [input]);
  } else {
    throw new Error(
      "Invalid input type. Supported types are string, Ethereum address, bigint, number, and boolean."
    );
  }
}

export function convertFromBytes(
  input: BytesLike,
  type: InputTypes
): string | AddressLike | bigint | number | boolean {
  const abiCoder = AbiCoder.defaultAbiCoder();

  if (type === InputTypes.ADDRESS) {
    return abiCoder.decode(["address"], input)[0];
  }
  if (type === InputTypes.UINT256) {
    return abiCoder.decode(["uint256"], input)[0];
  }
  if (type === InputTypes.STRING) {
    return abiCoder.decode(["string"], input)[0];
  }
  if (type === InputTypes.BOOLEAN) {
    return abiCoder.decode(["bool"], input)[0];
  } else {
    throw new Error(
      "Invalid input type. Supported types are string, Ethereum address, bigint, number, and boolean."
    );
  }
}

export function convertArrayIntoBytesArray(
  inputs: string[] | AddressLike[] | bigint[] | number[] | boolean[]
): BytesLike[] {
  return inputs.map((input) => convertIntoBytes(input));
}

export function numberToBytes4(value: number): string {
  const hexValue = value.toString(16).padStart(8, "0"); // Convert number to hexadecimal and pad with zeros to 8 characters
  return "0x" + hexValue; // Add '0x' prefix to indicate it's a hexadecimal value
}

export function getFunctionSelector(functionSignature: string): HexString {
  const functionHash = keccak256(toUtf8Bytes(functionSignature)).slice(2, 10);
  console.log(functionHash);
  // const functionSelector = encodeBytes32String(functionSignature).slice(2, 10);
  // console.log(functionSelector);
  return "0x" + functionHash;
}
