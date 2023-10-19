import * as dotenv from "dotenv";
import { JsonRpcProvider, Signer, Wallet } from "ethers";
dotenv.config();

export const stackupRpcUrl = process.env.STACKUP_RPC_URL || "";
export const rpcURL = process.env.ALCHEMY_URL ?? stackupRpcUrl;

const privateKey = process.env.PRIVATE_KEY || "0x123ABC123ABC";
const provider = new JsonRpcProvider(rpcURL);
const wallet = new Wallet(privateKey, provider) as Signer;
export const signer: Signer = wallet;

export const factoryAddress = "0xD9dAD33994fC4207838d90cC83E9F9CfCD295417";
// export const factoryAddress = "0x49a24CC4757A9267a6422593a509F0dD768dbB53";
export const strategyBuilderAddress =
  "0xb454B56C61E24e48A10174411748e0d09F838F99";
export const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const chainID = 11155111;
