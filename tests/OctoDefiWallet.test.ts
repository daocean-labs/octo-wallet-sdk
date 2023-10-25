import { formatEther, parseEther } from "ethers";
import { OctoDefiWallet } from "../src";
import {
  ChainID,
  ERC20TokenContracts,
  OctoDefiContracts,
} from "../src/constants";
import * as config from "./helper-test-config";
import { Token__factory } from "../src/typechain";

const STARTING_BALANCE = parseEther("0.005");
const STARTING_TOKEN_BALANCE = parseEther("100000");
const SWAP_AMOUNT = parseEther("200");

describe("OctoDefiWallet", () => {
  const { signer, rpcURL, stackupRpcUrl } = config;

  let octoWallet: OctoDefiWallet;
  let walletAddress: string;

  beforeEach(async () => {
    octoWallet = await OctoDefiWallet.init(
      signer,
      stackupRpcUrl,
      rpcURL,
      OctoDefiContracts[ChainID.Sepolia].Factory,
      OctoDefiContracts[ChainID.Sepolia].StrategyBuilder
    );

    walletAddress = octoWallet.getWalletAddress();

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

  test("execute the approve function from a ERC20 contract", async () => {
    const DFI = Token__factory.connect(
      ERC20TokenContracts[ChainID.Sepolia].DFI,
      signer
    );

    const routerAddress = OctoDefiContracts[ChainID.Sepolia].UniswapV2Router;

    const amount = SWAP_AMOUNT;

    const funcCallData = DFI.interface.encodeFunctionData("approve", [
      routerAddress,
      amount,
    ]);

    const to = await DFI.getAddress();

    await octoWallet.execute(to, BigInt(0), funcCallData);

    const allowance = await DFI.allowance(walletAddress, routerAddress);

    console.log(`The actual allowance is ${formatEther(allowance)}`);

    expect(allowance).toBe(amount);
  }, 70000);

  test("test swap tokens with execute tactics", async () => {
    //check the token Balances
    const DFI = Token__factory.connect(
      ERC20TokenContracts[ChainID.Sepolia].DFI,
      signer
    );

    const DUSD = Token__factory.connect(
      ERC20TokenContracts[ChainID.Sepolia].DUSD,
      signer
    );

    const tokenBalance = await DFI.balanceOf(walletAddress);

    if (
      (typeof tokenBalance == "bigint" && tokenBalance < SWAP_AMOUNT) ||
      typeof tokenBalance == "undefined"
    ) {
      const trx = await DFI.mint(walletAddress, STARTING_TOKEN_BALANCE);
      await trx.wait(1);
    }

    const tokenA = ERC20TokenContracts[ChainID.Sepolia].DFI;
    const tokenB = ERC20TokenContracts[ChainID.Sepolia].DUSD;

    const routerAddress = OctoDefiContracts[ChainID.Sepolia].UniswapV2Router;

    await octoWallet.executeSwapTacticWithExactAmount(
      tokenA,
      tokenB,
      SWAP_AMOUNT,
      routerAddress
    );

    const balanceDUSD = await DUSD.balanceOf(walletAddress);

    expect(balanceDUSD).toBeGreaterThan(0);
  }, 70000);
});
