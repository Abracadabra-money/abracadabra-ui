import { ethers, providers } from "ethers";
import { chainsList } from "@/helpers/chains/index";
import { createPublicClient, fallback, http } from "viem";

const simulatedGetUserBalance = async (
  provider: providers.StaticJsonRpcProvider
) => {
  try {
    const { address } = ethers.Wallet.createRandom();

    await provider.getBalance(address);

    return provider.connection.url;
  } catch (error) {
    console.log("getBlock error: ", error);
    return null;
  }
};

const filterActiveRpc = async (chainId: number | string): Promise<string[]> => {
  const currentChainConfig = chainsList[chainId as keyof typeof chainsList];

  const defaultRpc: string[] = currentChainConfig.rpcUrls.default.http;

  const rpcProviders = await Promise.all(
    defaultRpc.map(
      async (rpc: string) => await new providers.StaticJsonRpcProvider(rpc)
    )
  );

  const rpcUrls: any = await Promise.all(
    rpcProviders.map(
      async (provider) => await simulatedGetUserBalance(provider)
    )
  );

  return rpcUrls.filter(Boolean);
};

export const getPublicClient: any = async (chainId: number | string) => {
  const rpcUrls = await filterActiveRpc(chainId);
  // todo
  const transport = fallback(
    rpcUrls.map((rpc: string) => http(rpc)),
    { rank: true }
  );

  return createPublicClient({
    chain: chainsList[chainId as keyof typeof chainsList],
    transport: transport,
  });
};

// getEtherStaticJsonRpcProvider
// updated config
