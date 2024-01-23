import { JsonRpcProvider, ZeroAddress, ethers, parseEther } from "ethers";
import { OctoWallet } from "../src";
import * as config from "./helper-test-config";
import { EntryPoint, EntryPoint__factory } from "../src/typechain";
import { OctoDefiContracts } from "../src/constants";

const STARTING_BALANCE = parseEther("0.1");

describe("DiamondWallet", () => {
  let wallet: OctoWallet;
  let walletAddress: string;
  let provider: JsonRpcProvider;
  let entryPoint: EntryPoint;

  const { signer, rpcURL, stackupRpcUrl } = config;

  beforeEach(async () => {
    provider = new JsonRpcProvider(rpcURL);

    wallet = await OctoWallet.init(signer, stackupRpcUrl, rpcURL, {
      salt: BigInt(103),
    });

    walletAddress = wallet.getWalletAddress();

    const balance = await signer.provider?.getBalance(walletAddress);

    const chainId = (await provider.getNetwork()).chainId

    const entryPointAddress = OctoDefiContracts[Number(chainId)].EntryPoint

    entryPoint = EntryPoint__factory.connect(entryPointAddress, signer)

    const depositInfo = await entryPoint.deposits(walletAddress)


    if (depositInfo.deposit < ethers.parseEther("0.1")) {
      const trx = await entryPoint.depositTo(walletAddress, { value: ethers.parseEther("0.02") })
      await trx.wait(1)
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
