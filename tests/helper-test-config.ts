import * as dotenv from "dotenv";
import { JsonRpcProvider, Signer, Wallet } from "ethers";
dotenv.config();

export const stackupRpcUrl = process.env.BUNDLER_RPC || "";
export const rpcURL = process.env.RPC_URL ?? stackupRpcUrl;

const privateKey = process.env.PRIVATE_KEY || "0x123ABC123ABC";
const provider = new JsonRpcProvider(rpcURL);
const wallet = new Wallet(privateKey, provider) as Signer;
export const signer: Signer = wallet;
