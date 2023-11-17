# Utils Functions

## checkForWallets Function

### Description

This function is responsible for retrieving wallet addresses associated with a given address on the Ethereum blockchain using ethers.js library and predefined OctoDefiContracts.

### Parameters

- `address`: A string representing an Ethereum address.
- `provider`: An instance of JsonRpcProvider from ethers.js used to interact with the Ethereum network.

### Returns

- A Promise that resolves to an array of strings containing wallet addresses associated with the provided `address`.

### Throws

- Throws an Error if the provided `address` is not a valid Ethereum address.
- Throws an Error if the Ethereum network chainId is not supported within OctoDefiContracts.

### Usage

```typescript
import { JsonRpcProvider } from "ethers";
import { checkForWallets } from "octo-wallet-sdk";

const exampleAddress = "0x..."; // Ethereum address
const provider = new JsonRpcProvider("https://..."); // Ethereum JSON-RPC provider

try {
  const wallets = await checkForWallets(exampleAddress, provider);
  console.log("Associated Wallets:", wallets);
} catch (error) {
  console.error("Error:", error.message);
}
```
