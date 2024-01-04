import { multicall } from "@wagmi/core";
import type { Address } from "@wagmi/core";
import { ONE_ETHER_VIEM, MIM_PRICE } from "@/constants/global";
import type { ChainConfig } from "@/types/magicGlp/configsInfo";
import type { TokensInfo } from "@/types/magicGlp/tokensInfo";

export const getTokensInfo = async (
  address: Address,
  config: ChainConfig,
  publicClient: any
): Promise<TokensInfo> => {
  const { mainToken, stakeToken, oracle } = config;

  const [
    userMagicGlpBalance,
    totalSupply,
    userGlpBalance,
    allowanceAmount,
    oracleExchangeRate,
    magicGlpAmount,
  ]: any = await publicClient.multicall({
    contracts: [
      {
        ...mainToken.contract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...mainToken.contract,
        functionName: "totalSupply",
        args: [],
      },
      {
        ...stakeToken.contract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...stakeToken.contract,
        functionName: "allowance",
        args: [address, mainToken.contract.address],
      },
      {
        ...oracle,
        functionName: "peekSpot",
        args: ["0x"],
      },
      {
        ...stakeToken.contract,
        functionName: "balanceOf",
        args: [mainToken.contract.address],
      },
    ],
  });

  const mainTokenPrice =
    (MIM_PRICE * ONE_ETHER_VIEM) / oracleExchangeRate.result;
  const tokenRate =
    (magicGlpAmount.result * ONE_ETHER_VIEM) / totalSupply.result;
  const stakeTokenPrice = (mainTokenPrice * ONE_ETHER_VIEM) / tokenRate;

  const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;
  const mainTokenBalanceUsd =
    (userMagicGlpBalance.result * mainTokenPrice) / ONE_ETHER_VIEM;

  const stakeTokenBalanceUsd =
    (userGlpBalance.result * stakeTokenPrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: mainToken.name,
      icon: mainToken.icon,
      rateIcon: mainToken.rateIcon,
      decimals: mainToken.decimals,
      price: mainTokenPrice,
      rate: tokenRate,
      totalSupply: totalSupply.result,
      totalSupplyUsd,
      balance: userMagicGlpBalance.result,
      balanceUsd: mainTokenBalanceUsd,
      approvedAmount: allowanceAmount.result,
      contract: mainToken.contract,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      decimals: mainToken.decimals,
      price: stakeTokenPrice,
      balance: userGlpBalance.result,
      balanceUsd: stakeTokenBalanceUsd,
      contract: stakeToken.contract,
    },
  };
};
