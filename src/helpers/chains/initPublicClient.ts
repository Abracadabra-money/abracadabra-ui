import { createPublicClient, fallback, http } from "viem";

export const initPublicClient: any = (chainConfig: any) => {
  const defaultRpc: string[] = chainConfig.rpcUrls.default.http;

  const transport = fallback(
    defaultRpc.map((rpc: string) => http(rpc)),
    {
      rank: {
        interval: 15000,
        sampleCount: 10,
        timeout: 500,
      },
      retryCount: 5,
      retryDelay: 1000,
    }
  );

  return createPublicClient({
    chain: chainConfig,
    transport: transport,
    batch: {
      multicall: true,
    },
  });
};

// import { ethers, providers } from "ethers";

// export const getEtherStaticJsonRpcProvider = async (chainId: number) => {
//   const activeRpc = await filterActiveRpc(chainId);

//   return new providers.StaticJsonRpcProvider(activeRpc);
// };

// const filterActiveRpc = async (chainId: number) => {
//   const currentChainConfig = getChainConfig(chainId);

//   const defaultRpc: string[] = currentChainConfig.rpcUrls.default.http;

//   let index = 0;

//   while (defaultRpc.length) {
//     const provider = new providers.StaticJsonRpcProvider(defaultRpc[index]);
//     const response = await simulatedGetUserBalance(provider);
//     if (response) return response;
//     index++;
//   }
// };

// const simulatedGetUserBalance = async (
//   provider: providers.StaticJsonRpcProvider
// ) => {
//   try {
//     const { address } = ethers.Wallet.createRandom();

//     await provider.getBalance(address);

//     return provider.connection.url;
//   } catch (error) {
//     return null;
//   }
// };
