import { formatEther, parseEther } from "ethers";
import { OctoDefiWallet } from "../src";
import {
  ChainID,
  ERC20TokenContracts,
  OctoDefiContracts,
  Tacticts,
} from "../src/constants";
import * as config from "./helper-test-config";
import {
  IERC20Metadata__factory,
  StrategyBuilder__factory,
  Token__factory,
} from "../src/typechain";
import {
  InputTypes,
  convertArrayIntoBytesArray,
  convertFromBytes,
} from "../src/utils/convert";

const STARTING_BALANCE = parseEther("0.005");
const STARTING_TOKEN_BALANCE = parseEther("100000");
const SWAP_AMOUNT = parseEther("200");

describe("OctoDefiWallet", () => {
  const { signer, rpcURL, stackupRpcUrl } = config;

  let octoWallet: OctoDefiWallet;
  let walletAddress: string;
  let tokenA: string;
  let tokenB: string;
  const routerAddress = OctoDefiContracts[ChainID.Sepolia].UniswapV2Router;

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

    tokenA = ERC20TokenContracts[ChainID.Sepolia].DFI;
    tokenB = ERC20TokenContracts[ChainID.Sepolia].DUSD;
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

  test("set new strategy", async () => {
    const tacticID = [Tacticts[ChainID.Sepolia].Swap];

    const strategyID = BigInt(1);

    await octoWallet.setStrategy(strategyID, tacticID);

    const strategy = await octoWallet.getStrategy(strategyID);

    const strategyBuilderAddress =
      OctoDefiContracts[ChainID.Sepolia].StrategyBuilder;

    const strategyBuilder = StrategyBuilder__factory.connect(
      strategyBuilderAddress,
      signer
    );

    console.log(walletAddress);

    const tactics = await strategyBuilder.buildTacticsOutOfStrategy(strategy);

    expect(tactics[0].length).toBe(1);
  }, 70000);

  test("set strategy with all arguments", async () => {
    const tactics = [
      Tacticts[ChainID.Sepolia].Swap,
      Tacticts[ChainID.Sepolia].Swap,
    ];

    //TODO: Write the test with 2 swaps
    const swapAmountOne = parseEther("10");
    const swapAmountTwo = parseEther("5");

    const inputs: any[] = [];
    inputs.push(tokenA);
    inputs.push(tokenB);
    inputs.push(swapAmountOne);
    inputs.push(routerAddress);

    inputs.push(tokenB);
    inputs.push(tokenA);
    inputs.push(swapAmountTwo);
    inputs.push(routerAddress);

    const strategyID = BigInt(1);

    await octoWallet.setStrategyWithFunctionArgs(strategyID, tactics, inputs);

    //Assert
    const strategy = await octoWallet.getStrategy(strategyID);

    const strategyBuilderAddress =
      OctoDefiContracts[ChainID.Sepolia].StrategyBuilder;

    const strategyBuilder = StrategyBuilder__factory.connect(
      strategyBuilderAddress,
      signer
    );

    const actions = await strategyBuilder.buildTacticsOutOfStrategy(strategy);
    const tactic = await strategyBuilder.getTacticFunction(tactics[0]);
    const functionSelector = tactic[0];

    console.log(walletAddress);

    expect(actions[1][0]).toBe(functionSelector);
    expect(actions[1][1]).toBe(functionSelector);

    expect(actions[2][0]).toBe(BigInt(4));
    expect(actions[2][1]).toBe(BigInt(4));

    const slot = await octoWallet.getStorageSlot(
      tactic[2],
      BigInt(1),
      strategyID,
      BigInt(0)
    );

    const value = convertFromBytes(
      await octoWallet.getValue(slot),
      InputTypes.ADDRESS
    );

    expect(value).toBe(tokenB);
  }, 70000);

  test("execute a strategy", async () => {
    const tactics = [Tacticts[ChainID.Sepolia].Swap];

    const inputs: any[] = [];
    inputs.push(tokenA);
    inputs.push(tokenB);
    inputs.push(SWAP_AMOUNT);
    inputs.push(routerAddress);

    const strategyID = BigInt(2);

    await octoWallet.setStrategyWithFunctionArgs(strategyID, tactics, inputs);

    const tokenAContract = Token__factory.connect(tokenA, signer);
    const balanceBeforeTokenA = await tokenAContract.balanceOf(walletAddress);
    const tokenBContract = Token__factory.connect(tokenB, signer);
    const balanceBeforTokenB = await tokenBContract.balanceOf(walletAddress);

    await octoWallet.executeStrategy(strategyID);

    const balanceAfterTokenA = await tokenAContract.balanceOf(walletAddress);
    const balanceAfterTokenB = await tokenBContract.balanceOf(walletAddress);

    expect(balanceAfterTokenA).toBe(balanceBeforeTokenA - SWAP_AMOUNT);
    expect(balanceAfterTokenB).toBeGreaterThan(balanceBeforTokenB);
  }, 70000);

  test("test transfer ERC20 token", async () => {
    const trasferAmount = parseEther("15");

    const signerAddress = await signer.getAddress();

    const tokenAContract = IERC20Metadata__factory.connect(tokenA, signer);
    const balanceBefore = await tokenAContract.balanceOf(signerAddress);

    await octoWallet.transferERC20Token(tokenA, signerAddress, trasferAmount);

    //Assert
    const balanceAfter = await tokenAContract.balanceOf(signerAddress);

    expect(balanceAfter).toBe(balanceBefore + trasferAmount);
  }, 70000);
});
