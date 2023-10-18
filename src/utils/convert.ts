import { AbiCoder, BytesLike, ethers, isAddress } from "ethers";

export function convertIntoBytes(data: string | bigint): BytesLike {
  if (isAddress(data)) {
    return AbiCoder.defaultAbiCoder().encode(["address"], [data]);
  } else {
    return AbiCoder.defaultAbiCoder().encode(["uint256"], [data]);
  }
}
