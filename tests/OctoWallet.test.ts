import { JsonRpcProvider, ZeroAddress, parseEther } from "ethers";
import { OctoWallet } from "../src";
import * as config from "./helper-test-config";

const STARTING_BALANCE = parseEther("1.0");

describe("DiamondWallet", () => {
  let wallet: OctoWallet;
  let walletAddress: string;
  let provider: JsonRpcProvider;

  const { signer, rpcURL, stackupRpcUrl } = config;

  beforeEach(async () => {
    provider = new JsonRpcProvider(rpcURL);

    wallet = await OctoWallet.init(signer, stackupRpcUrl, rpcURL, {
      salt: BigInt(103),
    });

    walletAddress = wallet.getWalletAddress();

    const balance = await signer.provider?.getBalance(walletAddress);

    if (
      (typeof balance == "bigint" && balance <= parseEther("1.0")) ||
      typeof balance == "undefined"
    ) {
      const tx = await signer.sendTransaction({
        to: walletAddress,
        value: STARTING_BALANCE,
      });

      await tx.wait(1);
    }
  }, 70000);

  describe("wallet information test", () => {
    let counter = 0;
    beforeEach(async () => {
      const deployed = wallet.getDeploymentStatus();

      if (!deployed) {
        const address = await signer.getAddress();
        await wallet.execute(address, parseEther("0.001"), "0x");
        counter++;
        console.log(counter);
      }
    }, 70000);

    test("wallet return the correct facetaddresses", async () => {
      const facetAddresses = await wallet.getFacetAddresses();

      expect(facetAddresses.length).toBe(4);
    });

    test("wallet show a wallet address", () => {
      walletAddress = wallet.getWalletAddress();
      console.log(walletAddress);
      expect(walletAddress).not.toBe(ZeroAddress);
    });

    test("wallet return the correct owner address", async () => {
      const signerAddress = await signer.getAddress();

      const owner = await wallet.getWalletOwner();

      expect(owner).toBe(signerAddress);
    });
  });

  test("send ether to a recipient address", async () => {
    const address = await signer.getAddress();

    const balanceBefore = await provider.getBalance(address);

    const res = await wallet.execute(address, parseEther("0.001"), "0x");

    const balanceAfter = await provider.getBalance(address);

    expect(balanceAfter).toBeGreaterThan(balanceBefore);

    if (res) {
      console.log(res);
      expect(res.success).toBeTruthy();
    }
  }, 70000);
});
