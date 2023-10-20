import * as dotenv from "dotenv";
import { JsonRpcProvider, Signer, Wallet } from "ethers";
dotenv.config();

export const stackupRpcUrl = process.env.STACKUP_RPC_URL || "";
export const rpcURL = process.env.ALCHEMY_URL ?? stackupRpcUrl;

const privateKey = process.env.PRIVATE_KEY || "0x123ABC123ABC";
const provider = new JsonRpcProvider(rpcURL);
const wallet = new Wallet(privateKey, provider) as Signer;
export const signer: Signer = wallet;
