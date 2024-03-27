import { ethers, providers } from "ethers";
import { chainsList } from "@/helpers/chains/index";
import { createPublicClient, fallback, http } from "viem";

export const getPublicClient: any = (chainId: number | string) => {
  const currentChainConfig = chainsList[chainId as keyof typeof chainsList];
  const defaultRpc: string[] = currentChainConfig.rpcUrls.default.http;

  const transport = fallback(
    defaultRpc.map((rpc: string) => http(rpc)),
    { rank: true }
  );

  return createPublicClient({
    chain: chainsList[chainId as keyof typeof chainsList],
    transport: transport,
  });
};

export const getEtherStaticJsonRpcProvider = async (chainId: number) => {
  const activeRpc = await filterActiveRpc(chainId);

  return new providers.StaticJsonRpcProvider(activeRpc);
};

const filterActiveRpc = async (chainId: number) => {
  const currentChainConfig = chainsList[chainId as keyof typeof chainsList];

  const defaultRpc: string[] = currentChainConfig.rpcUrls.default.http;

  let index = 0;

  while (defaultRpc.length) {
    const provider = new providers.StaticJsonRpcProvider(defaultRpc[index]);
    const response = await simulatedGetUserBalance(provider);
    if (response) return response;
    index++;
  }
};

const simulatedGetUserBalance = async (
  provider: providers.StaticJsonRpcProvider
) => {
  try {
    const { address } = ethers.Wallet.createRandom();

    await provider.getBalance(address);

    return provider.connection.url;
  } catch (error) {
    return null;
  }
};
