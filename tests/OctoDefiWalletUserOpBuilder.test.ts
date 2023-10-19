import { OctoDefiWalletUserOpBuilder } from "../src";
import { Client } from "userop";
import * as config from "../src/utils/helper-test-config";
import { JsonRpcProvider, Wallet, ethers, parseEther } from "ethers";
import {
  EntryPoint__factory,
  SmartStrategyWallet__factory,
} from "../src/typechain";
import { UserOperationStruct } from "../src/typechain/EntryPoint";

describe("OctoDefiWalletUserOpBuilder", () => {
  const {
    signer,
    rpcURL,
    stackupRpcUrl,
    factoryAddress,
    strategyBuilderAddress,
    chainID,
    entryPointAddress,
  } = config;

  describe("builder initialize correct", () => {
    test("builder initialized corret", async () => {
      const builder = await OctoDefiWalletUserOpBuilder.init(
        signer,
        stackupRpcUrl,
        factoryAddress,
        strategyBuilderAddress
      );
    });
  });

  describe("test add owner", () => {
    test("add new owner without a deployed scw", async () => {
      const client = await Client.init(stackupRpcUrl);

      const signerWallet = Wallet.createRandom();

      const newOwner = Wallet.createRandom().address;

      const builder = await OctoDefiWalletUserOpBuilder.init(
        signerWallet,
        stackupRpcUrl,
        factoryAddress,
        strategyBuilderAddress
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

        const resp = await tx.wait(2);
        console.log(resp);
      }

      const signature = builder.getSignature();
      console.log(signature);

      builder.addOwner(newOwner);

      const userOp = await builder.buildOp(entryPointAddress, chainID);
      console.log(userOp);

      const res = await client.sendUserOperation(builder);

      const env = await res.wait();
      console.log(env);

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
