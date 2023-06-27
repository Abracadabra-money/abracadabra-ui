import { type WalletClient, getWalletClient, getPublicClient } from "@wagmi/core";
import { providers } from "ethers";

export async function walletClientToSigner(walletClient: WalletClient) {
    
  const publicClient = getPublicClient()
  const { chain } = publicClient;
  const { account, transport } = walletClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);

  console.log("signer", signer);
  return signer;
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = await getWalletClient({ chainId });
  if (!walletClient) return undefined;
  return await walletClientToSigner(walletClient);
}
