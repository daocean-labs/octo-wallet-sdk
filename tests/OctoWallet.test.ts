import { JsonRpcProvider, ZeroAddress, ethers, parseEther } from "ethers";
import { OctoWallet } from "../src";
import * as config from "./helper-test-config";
import { EntryPoint, EntryPoint__factory } from "../src/typechain";
import { OctoDefiContracts } from "../src/constants";
import { simplePaymaster } from "../src/middleware";
import { Presets } from "userop";

const STARTING_BALANCE = parseEther("0.1");
const WALLET_FACTORY = "0x4Cc2be4759ac40Cb0689816888F4785Ed80c00Dc";
const pamyasterURL = process.env.PAYMASTER_RPC_URL || "";

describe("DiamondWallet", () => {
  let wallet: OctoWallet;
  let walletAddress: string;
  let provider: JsonRpcProvider;
  let entryPoint: EntryPoint;

  const { signer, rpcURL, stackupRpcUrl } = config;

  beforeEach(async () => {
    provider = new JsonRpcProvider(rpcURL);

    // const simplePaymasterFunction = simplePaymaster(provider, "");

    const paymasterContext = { type: "payg" };
    const paymaster = Presets.Middleware.verifyingPaymaster(
      pamyasterURL,
      paymasterContext
    );

    wallet = await OctoWallet.init(
      signer,
      stackupRpcUrl,
      rpcURL,
      WALLET_FACTORY,
      {
        salt: BigInt(103),
        paymasterMiddleware: paymaster,
      }
    );

    walletAddress = wallet.getWalletAddress();

    const chainId = (await provider.getNetwork()).chainId;

    const entryPointAddress = OctoDefiContracts[Number(chainId)].EntryPoint;
    const paymasterAddress = OctoDefiContracts[Number(chainId)].Paymaster;

    entryPoint = EntryPoint__factory.connect(entryPointAddress, signer);

    const depositInfo = await entryPoint.deposits(paymasterAddress);

    if (depositInfo.deposit < ethers.parseEther("0.1")) {
      const trx = await entryPoint.depositTo(paymasterAddress, {
        value: ethers.parseEther("0.2"),
      });
      await trx.wait(1);
    }

    const balance = await provider.getBalance(walletAddress);

    if (balance < ethers.parseEther("0.1")) {
      const trx = await signer.sendTransaction({
        to: walletAddress,
        value: ethers.parseEther("0.11"),
      });

      await trx.wait(1);
    }
  }, 70000);

  test("send ether to a recipient address", async () => {
    const address = await signer.getAddress();

    const balanceBefore = await provider.getBalance(address);

    const res = await wallet.execute(address, parseEther("0.001"), "0x");

    const balanceAfter = await provider.getBalance(address);

    expect(balanceAfter).toBeGreaterThanOrEqual(balanceBefore);

    if (res) {
      console.log(res);
      expect(res.success).toBeTruthy();
    }
  }, 70000);
});
