import { ZeroAddress, parseEther } from "ethers";
import { DiamondWallet } from "../src";
import * as config from "./helper-test-config";

const STARTING_BALANCE = parseEther("0.005");

describe("DiamondWallet", () => {
  let wallet: DiamondWallet;
  let walletAddress: string;

  //   const { signer } = config;
  //   const rpcURL = "http://defi-etf.com:8545/";
  //   const stackupRpcUrl = "http://defi-etf.com:4337/";
  const { signer, rpcURL, stackupRpcUrl } = config;

  beforeEach(async () => {
    wallet = await DiamondWallet.init(signer, stackupRpcUrl, rpcURL);

    walletAddress = wallet.getWalletAddress();

    const balance = await signer.provider?.getBalance(walletAddress);

    if (
      (typeof balance == "bigint" && balance == BigInt(0)) ||
      typeof balance == "undefined"
    ) {
      const tx = await signer.sendTransaction({
        to: walletAddress,
        value: STARTING_BALANCE,
      });

      await tx.wait(1);
    }
  }, 70000);

  test("wallet show a wallet address", () => {
    walletAddress = wallet.getWalletAddress();
    console.log(walletAddress);
    expect(walletAddress).not.toBe(ZeroAddress);
  }, 70000);

  test("send ether to a recipient address", async () => {
    const address = await signer.getAddress();
    const ev = await wallet.execute(address, parseEther("0.001"), "0x");

    console.log(ev);
  }, 70000);
});
