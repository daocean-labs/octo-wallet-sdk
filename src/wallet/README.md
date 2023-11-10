# DiamondWallet Documentation

## Overview

The `DiamondWallet` class is designed to interact with a smart contract wallet designed with the ERC4337 and ERC2535 standards. It provides functionalities for initializing, accessing wallet information, and executing operations on the diamond contract. This documentation outlines the key components, methods, and usage patterns of the `DiamondWallet` class.

## Class Structure

### Properties

- **walletAddress**: The address of the diamond wallet.
- **signer**: An Ethereum signer used for transaction signing.
- **publicProvider**: An instance of `JsonRpcProvider` connected to the public Ethereum network.
- **userOPBuilder**: An instance of `DiamondWalletUserOpBuilder` for building user operations.
- **client**: An instance of `Client` for interacting with a user operation bundler.
- **functions**: An array of Ethereum function selectors.
- **facets**: An array of facet addresses associated with the diamond wallet.
- **diamondLoupe**: An instance of `DiamondLoupeFacet` for interacting with diamond-specific functions.

### Static Method

- **public static async init(signer: ethers.Signer, bundlerRpcUrl: string, rpcUrl: string, salt?: bigint)**: Initializes a new `DiamondWallet` instance. It connects to the Ethereum network, retrieves necessary contract addresses, and sets up the user operation builder.

## Getter Functions

- **getWalletAddress(): string**: Retrieves the wallet address.
- **getUserOpBuilder(): DiamondWalletUserOpBuilder | null**: Retrieves the user operation builder instance.
- **getClient(): Client | null**: Retrieves the client instance for interacting with the bundler.
- **getFacetAddresses(): Array<string>**: Retrieves an array of facet addresses associated with the diamond wallet.
- **getFunctions(): Array<BytesLike>**: Retrieves an array of Ethereum function selectors.
- **getActiveSigner(): ethers.Signer**: Retrieves the active Ethereum signer.

## Core Facet Interactions

- **async execute(to: string, value: bigint, data: BytesLike): Promise<UserOperationEventEvent | null>**: Executes a core facet operation on the diamond wallet, sending a user operation with the specified parameters.

## Usage

1. **Initialization**:

   ```javascript
   const signer = ...; // Initialize an Ethereum signer
   const bundlerRpcUrl = '...'; // URL of the user operation bundler
   const rpcUrl = '...'; // URL of the public Ethereum network
   const diamondWallet = await DiamondWallet.init(signer, bundlerRpcUrl, rpcUrl);
   ```

2. **Accessing Information**:

   ```javascript
   const walletAddress = diamondWallet.getWalletAddress();
   const userOPBuilder = diamondWallet.getUserOpBuilder();
   const client = diamondWallet.getClient();
   const facetAddresses = diamondWallet.getFacetAddresses();
   const functions = diamondWallet.getFunctions();
   const activeSigner = diamondWallet.getActiveSigner();
   ```

3. **Executing Operations**:
   ```javascript
   const to = "0x..."; // Target address for the operation
   const value = BigInt("1000000000000000000"); // Value in Wei
   const data = "0x..."; // Encoded function data
   const result = await diamondWallet.execute(to, value, data);
   if (result) {
     console.log("Operation successful:", result);
   } else {
     console.error("Operation failed.");
   }
   ```

Note: Replace placeholder values (`'...'`, `0x...`) with actual values relevant to your use case. Ensure that you have the necessary dependencies and configurations set up before using the `DiamondWallet` class.
