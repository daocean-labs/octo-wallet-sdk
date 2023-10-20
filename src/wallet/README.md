# OctoDefiWallet Typescript Wallet Documentation

The `OctoDefiWallet` class is part of the OctoDefi package, providing an interface to interact with a Smart Strategy Wallet on an EVM chain. This document outlines the usage, functionalities, and interactions provided by this class.

## Usage

### Importing the Class

```javascript
import { OctoDefiWallet } from "octodefi-package";
```

### Initializing OctoDefiWallet

To initialize the `OctoDefiWallet` class, use the `init` method:

```javascript
const signer = ... // ethers.Signer instance;
const bundlerRpcUrl = 'https://bundler-rpc-url.com';
const rpcUrl = 'https://ethereum-rpc-url.com';
const factoryAddress = '0xFactoryAddress';
const strategyBuilderAddress = '0xStrategyBuilderAddress';

const octoDefiWallet = await OctoDefiWallet.init(
  signer,
  bundlerRpcUrl,
  rpcUrl,
  factoryAddress,
  strategyBuilderAddress
);
```

### Getter Functions

- **Get Wallet Address:**

  ```javascript
  const walletAddress = octoDefiWallet.getWalletAddress();
  ```

- **Get User Operation Builder:**

  ```javascript
  const builder = octoDefiWallet.getBuilder();
  ```

- **Get Active Signer:**

  ```javascript
  const activeSigner = octoDefiWallet.getActiveSigner();
  ```

- **Get Wallet Contract:**
  ```javascript
  const walletContract = octoDefiWallet.getWalletContract();
  ```

### Wallet Interactions

- **Add New Owner:**

  ```javascript
  const ownerAddress = "0xNewOwnerAddress";
  const transactionHash = await octoDefiWallet.addNewOwner(ownerAddress);
  ```

- **Remove Owner:**

  ```javascript
  const ownerAddress = "0xOwnerAddressToRemove";
  const transactionHash = await octoDefiWallet.removeOwner(ownerAddress);
  ```

- **Transfer Native Coin:**
  ```javascript
  const toAddress = "0xRecipientAddress";
  const value = BigInt(1000000000000000000); // 1 ETH in wei
  const transactionHash = await octoDefiWallet.transferNativeCoin(
    toAddress,
    value
  );
  ```

### Additional Functions

- **Get Storage Slots:**
  ```javascript
  const strategyID = BigInt(123);
  const tactics = ["0x45129000", "0x4512932"]; // Array of tactic bytes store in the strategy builder
  const numArgs = [2, 3]; // Array of numbers of arguments for each tactic
  const storageSlots = await octoDefiWallet.getStorageSlots(
    strategyID,
    tactics,
    numArgs
  );
  ```

## Exception Handling

The class may throw errors in case of invalid inputs or uninitialized state. Please handle exceptions appropriately to ensure the smooth operation of your application.

## Notes

- Ensure proper error handling and validation for all user inputs.
- Make sure to handle asynchronous operations using `async/await` or `Promise.then()`.
- Refer to the official Ethereum and OctoDefi documentation for more details on specific functions and parameters.

For more detailed information, please refer to the source code and inline comments within the class.
