import { JsonRpcProvider, ZeroAddress, ethers, parseEther } from "ethers";
import { OctoWallet } from "../src";
import * as config from "./helper-test-config";
import { EntryPoint, EntryPoint__factory } from "../src/typechain";
import { OctoDefiContracts } from "../src/constants";
import { simplePaymaster } from "../src/middleware";

const STARTING_BALANCE = parseEther("0.1");

describe("DiamondWallet", () => {
  let wallet: OctoWallet;
  let walletAddress: string;
  let provider: JsonRpcProvider;
  let entryPoint: EntryPoint;

  const { signer, rpcURL, stackupRpcUrl } = config;

  beforeEach(async () => {
    provider = new JsonRpcProvider(rpcURL);

    const simplePaymasterFunction = simplePaymaster(provider, "");

    wallet = await OctoWallet.init(signer, stackupRpcUrl, rpcURL, {
      salt: BigInt(103),
      paymasterMiddleware: simplePaymasterFunction,
    });

    walletAddress = wallet.getWalletAddress();

    const chainId = (await provider.getNetwork()).chainId;

    const entryPointAddress = OctoDefiContracts[Number(chainId)].EntryPoint;
    const paymasterAddress = OctoDefiContracts[Number(chainId)].Paymaster;

    entryPoint = EntryPoint__factory.connect(entryPointAddress, signer);

    const depositInfo = await entryPoint.deposits(paymasterAddress);

    if (depositInfo.deposit < ethers.parseEther("0.2")) {
      const trx = await entryPoint.depositTo(paymasterAddress, {
        value: ethers.parseEther("0.3"),
      });
      await trx.wait(1);
    }
  }, 70000);

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
