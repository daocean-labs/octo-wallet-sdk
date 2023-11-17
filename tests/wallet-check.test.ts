import { JsonRpcProvider } from "ethers";
import * as config from "./helper-test-config";
import { checkForWallets } from "../src/utils/wallet-check";
import { OwnershipFacet__factory } from "../src/typechain";

describe("wallet-check-function", () => {
  let provider: JsonRpcProvider;
  const { signer, rpcURL, stackupRpcUrl } = config;

  beforeEach(async () => {
    provider = new JsonRpcProvider(rpcURL);
  }, 70000);

  test("test the correct deployed wallets returned by creation", async () => {
    const address = await signer.getAddress();

    const wallets = await checkForWallets(address, provider);

    wallets.forEach(async (wallet) => {
      const ownerFacet = OwnershipFacet__factory.connect(
        wallet.address,
        provider
      );

      const owner = await ownerFacet.owner();

      expect(owner).toBe(address);
    });
  }, 70000);
});
