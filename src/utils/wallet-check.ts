import { JsonRpcProvider, ZeroAddress, isAddress } from "ethers";
import { OctoDefiContracts } from "../constants";
import { OctoWalletFactory__factory } from "../typechain";

export interface CheckWalletInfo {
  address: string;
  salt: bigint;
}

export async function checkForWallets(
  address: string,
  provider: JsonRpcProvider
): Promise<Array<CheckWalletInfo>> {
  if (!isAddress(address)) throw Error("No Valid Address!");

  const chainId = (await provider.getNetwork()).chainId;

  if (!(Number(chainId) in OctoDefiContracts)) throw Error("Not valid chain!");

  const block = await provider.getBlock("latest");
  const factoryAddress = OctoDefiContracts[Number(chainId)].Factory;

  const factory = OctoWalletFactory__factory.connect(factoryAddress, provider);

  const events = await factory.queryFilter(factory.filters.WalletCreated());

  const wallets = events
    .filter((event) => event.args.owner == address)
    .map((event) => {
      return { address: event.args.wallet, salt: event.args.salt };
    });

  return wallets;
}
