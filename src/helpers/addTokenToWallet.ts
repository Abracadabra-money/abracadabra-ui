import { getPublicClient } from "@/helpers/chains/getChainsInfo";

type TokenInfo = {
  name: string;
  address: string;
  decimals: number;
  abi: any;
};

export const addTokenToWallet = async (
  chainId: number,
  tokenInfo: TokenInfo,
  icon: string
) => {
  try {
    const publicClient = getPublicClient(chainId);

    const symbol = await publicClient.readContract({
      address: tokenInfo.address,
      abi: tokenInfo.abi,
      functionName: "symbol",
      args: [],
    });

    const { ethereum }: any = window;

    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenInfo.address,
          symbol: symbol,
          decimals: tokenInfo.decimals,
          image: icon,
        },
      },
    });
  } catch (error) {
    console.log("Add collateral token error:", error);
  }
};
