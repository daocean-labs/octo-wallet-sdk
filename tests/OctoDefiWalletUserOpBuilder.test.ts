import { OctoDefiWalletUserOpBuilder } from "../src";
import { OctoDefiContracts, ChainID } from "../src/constants";
import { Client } from "userop";
import * as config from "./helper-test-config";
import { JsonRpcProvider, Wallet, parseEther } from "ethers";
import { SmartStrategyWallet__factory } from "../src/typechain";

describe("OctoDefiWalletUserOpBuilder", () => {
  const { signer, rpcURL, stackupRpcUrl } = config;

  describe("test add owner", () => {
    test("add new owner without a deployed scw", async () => {
      const client = await Client.init(stackupRpcUrl);

      const signerWallet = Wallet.createRandom();

      const newOwner = Wallet.createRandom().address;

      const builder = await OctoDefiWalletUserOpBuilder.init(
        signerWallet,
        stackupRpcUrl,
        OctoDefiContracts[ChainID.Sepolia].Factory,
        OctoDefiContracts[ChainID.Sepolia].StrategyBuilder
      );

      const balance = await signer.provider?.getBalance(builder.getSender());

      if (
        (typeof balance == "bigint" && balance == BigInt(0)) ||
        typeof balance == "undefined"
      ) {
        const tx = await signer.sendTransaction({
          to: builder.getSender(),
          value: parseEther("0.005"),
        });

        await tx.wait(2);
      }

      builder.addOwner(newOwner);

      await builder.buildOp(
        OctoDefiContracts[ChainID.Sepolia].EntryPoint,
        ChainID.Sepolia
      );

      const res = await client.sendUserOperation(builder);

      await res.wait();

      const smartContractWalletAddress = await builder.proxy.getAddress();

      const provider = new JsonRpcProvider(rpcURL);
      const scw = SmartStrategyWallet__factory.connect(
        smartContractWalletAddress,
        provider
      );

      const isOwner = await scw.isOwner(newOwner);

      expect(isOwner).toBeTruthy();
    }, 70000);
  });
});
