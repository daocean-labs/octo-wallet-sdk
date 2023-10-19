# OctoDefi Wallet TypeScript Package Documentation

## Usage

### Importing the Package

```typescript
import { OctoDefiWalletUserOpBuilder } from "octodefi-wallet";
```

### Initializing the OctoDefiWalletUserOpBuilder

```typescript
const signer: ethers.Signer; // Your Ethereum signer instance
const rpcUrl: string; // RPC URL of the Ethereum node
const factoryAddress: string; // Address of the SmartStrategyWalletFactory contract
const strategyBuilderAddress: string; // Address of the strategy builder contract

const octoDefiWallet = await OctoDefiWalletUserOpBuilder.init(
  signer,
  rpcUrl,
  factoryAddress,
  strategyBuilderAddress
);
```

### Building Transactions

#### Execute a Transaction

```typescript
const to: string; // Destination address
const value: bigint; // Amount to send (in wei)
const data: BytesLike; // Transaction data

const transactionData = octoDefiWallet.execute(to, value, data);
```

#### Execute Batch Transactions

```typescript
const to: Array<string>; // Array of destination addresses
const value: Array<bigint>; // Array of amounts to send (in wei)
const data: Array<BytesLike>; // Array of transaction data

const batchTransactionData = octoDefiWallet.executeBatch(to, value, data);
```

#### Add and Remove Owners

```typescript
const newOwner: string; // Address of the new owner

const addOwnerData = octoDefiWallet.addOwner(newOwner);
const removeOwnerData = octoDefiWallet.removeOwner(owner);
```

#### Set New Strategy Builder

```typescript
const strategyBuilder: string; // Address of the new strategy builder contract

const setStrategyBuilderData =
  octoDefiWallet.setNewStrategyBuilder(strategyBuilder);
```

#### Set Strategy

```typescript
const strategyID: bigint; // ID of the strategy
const tactics: Array<BytesLike>; // Array of tactic data

const setStrategyData = octoDefiWallet.setStrategy(strategyID, tactics);
```

### Executing Transactions

After building the transaction data, you can execute the transaction using your preferred Ethereum library (such as ethers.js) to send the transaction to the Ethereum network.

## Class: OctoDefiWalletUserOpBuilder

### Methods

#### `init(signer, rpcUrl, factoryAddress, strategyBuilderAddress, opts?)`

- **Parameters:**

  - `signer`: Ethereum signer instance.
  - `rpcUrl`: RPC URL of the Ethereum node.
  - `factoryAddress`: Address of the SmartStrategyWalletFactory contract.
  - `strategyBuilderAddress`: Address of the strategy builder contract.
  - `opts`: Optional preset builder options.

- **Returns:**
  - `OctoDefiWalletUserOpBuilder`: Initialized OctoDefiWalletUserOpBuilder instance.

#### `execute(to, value, data)`

- **Parameters:**

  - `to`: Destination address.
  - `value`: Amount to send (in wei).
  - `data`: Transaction data.

- **Returns:**
  - `string`: Encoded transaction data for executing the transaction.

#### `executeBatch(to, value, data)`

- **Parameters:**

  - `to`: Array of destination addresses.
  - `value`: Array of amounts to send (in wei).
  - `data`: Array of transaction data.

- **Returns:**
  - `string`: Encoded transaction data for executing the batch transaction.

#### `addOwner(newOwner)`

- **Parameters:**

  - `newOwner`: Address of the new owner.

- **Returns:**
  - `string`: Encoded transaction data for adding a new owner.

#### `removeOwner(owner)`

- **Parameters:**

  - `owner`: Address of the owner to be removed.

- **Returns:**
  - `string`: Encoded transaction data for removing an owner.

#### `setNewStrategyBuilder(strategyBuilder)`

- **Parameters:**

  - `strategyBuilder`: Address of the new strategy builder contract.

- **Returns:**
  - `string`: Encoded transaction data for setting a new strategy builder.

#### `setStrategy(strategyID, tactics)`

- **Parameters:**

  - `strategyID`: ID of the strategy.
  - `tactics`: Array of tactic data.

- **Returns:**
  - `string`: Encoded transaction data for setting a strategy.

### Example

```typescript
import { ethers } from "ethers";
import { OctoDefiWalletUserOpBuilder } from "octodefi-wallet";

async function main() {
  const rpcUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
  const signer = new ethers.Wallet("YOUR_PRIVATE_KEY");

  const factoryAddress = "0x..."; // Address of the SmartStrategyWalletFactory contract
  const strategyBuilderAddress = "0x..."; // Address of the strategy builder contract

  const octoDefiWallet = await OctoDefiWalletUserOpBuilder.init(
    signer,
    rpcUrl,
    factoryAddress,
    strategyBuilderAddress
  );

  const to = "0x..."; // Destination address
  const value = ethers.utils.parseEther("1"); // 1 ETH in wei
  const data = "0x..."; // Transaction data

  const transactionData = octoDefiWallet.execute(to, value, data);

  // Now you can send the transaction using ethers.js or any other Ethereum library
  // For example:
  const gasPrice = await octoDefiWallet.provider.getGasPrice();
  const gasLimit = 21000; // Specify an appropriate gas limit
  const nonce = await signer.getTransactionCount();
  const rawTransaction = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    to: octoDefiWallet.proxy.address,
    value: 0,
    data: transactionData,
  };

  const signedTransaction = await signer.signTransaction(rawTransaction);
  const transactionResponse =
    await octoDefiWallet.provider.sendTransaction(signedTransaction);
  console.log("Transaction Hash:", transactionResponse.hash);
}

main();
```

## Conclusion

The OctoDefi Wallet TypeScript package simplifies the process of managing complex transactions and smart contract interactions on the Ethereum blockchain. It provides a powerful toolset for developers to create and execute transactions with ease. For more detailed information and usage examples, refer to the official documentation and source code.
