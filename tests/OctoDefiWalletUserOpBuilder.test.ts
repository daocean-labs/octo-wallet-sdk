import { OctoDefiWalletUserOpBuilder } from "../src";
import { Client } from "userop";
import * as config from "../src/utils/helper-test-config";
import { Wallet, ethers, parseEther } from "ethers";
import { EntryPoint__factory } from "../src/typechain";
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
        factoryAddress
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
        factoryAddress
      );

      const balance = await signer.provider?.getBalance(builder.getSender());

      if (
        (typeof balance == "bigint" && balance == BigInt(0)) ||
        typeof balance == "undefined"
      ) {
        const tx = await signer.sendTransaction({
          to: builder.getSender(),
          value: parseEther("0.01"),
        });

        const resp = await tx.wait(3);
        console.log(resp);
      }

      const signature = builder.getSignature();
      console.log(signature);

      // builder.execute(
      //   "0x9e867802DdF0CeA68455B6feA38cCA8d78a4A8eF",
      //   parseEther("0.002"),
      //   "0x"
      // );

      // builder.addOwner("0x9e867802DdF0CeA68455B6feA38cCA8d78a4A8eF");
      builder.addOwner(newOwner);

      const userOp = await builder.buildOp(entryPointAddress, chainID);
      console.log(userOp);

      // const res = await client.sendUserOperation(builder);

      // const env = await res.wait();
      // console.log(env);

      const entryPoint = EntryPoint__factory.connect(entryPointAddress, signer);

      const userOpInput: UserOperationStruct = userOp as UserOperationStruct;

      const signerAddress = await signer.getAddress();
      const trx = await entryPoint.handleOps([userOpInput], signerAddress);

      await trx.wait();

      console.log(trx);
    }, 60000);
  });
});
