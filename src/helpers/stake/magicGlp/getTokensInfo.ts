import type { Address } from "viem";
import type { PublicClient } from "viem";
import { ONE_ETHER_VIEM, MIM_PRICE } from "@/constants/global";
import type { ChainConfig } from "@/configs/stake/magicGlp/magicGlpConfig";

export const getTokensInfo = async (
  address: Address,
  config: ChainConfig,
  publicClient: PublicClient
) => {
  const { mainToken, stakeToken, oracle } = config;

  const [
    userMagicGlpBalance,
    totalSupply,
    userGlpBalance,
    allowanceAmount,
    oracleExchangeRate,
    magicGlpAmount,
  ] = await publicClient.multicall({
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
    (MIM_PRICE * ONE_ETHER_VIEM) / (oracleExchangeRate.result as bigint);
  const tokenRate =
    ((magicGlpAmount.result as bigint) * ONE_ETHER_VIEM) /
    (totalSupply.result as bigint);
  const stakeTokenPrice = (mainTokenPrice * ONE_ETHER_VIEM) / tokenRate;

  const totalSupplyUsd =
    ((totalSupply.result as bigint) * mainTokenPrice) / ONE_ETHER_VIEM;
  const mainTokenBalanceUsd =
    ((userMagicGlpBalance.result as bigint) * mainTokenPrice) / ONE_ETHER_VIEM;

  const stakeTokenBalanceUsd =
    ((userGlpBalance.result as bigint) * stakeTokenPrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: mainToken.name,
      icon: mainToken.icon,
      rateIcon: mainToken.rateIcon,
      decimals: mainToken.decimals,
      price: mainTokenPrice,
      rate: tokenRate,
      totalSupply: totalSupply.result as bigint,
      totalSupplyUsd,
      balance: userMagicGlpBalance.result as bigint,
      balanceUsd: mainTokenBalanceUsd,
      contract: mainToken.contract,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      contract: stakeToken.contract,
      price: stakeTokenPrice,
      decimals: mainToken.decimals,
      balance: userGlpBalance.result as bigint,
      balanceUsd: stakeTokenBalanceUsd,
      approvedAmount: allowanceAmount.result as bigint,
    },
  };
};
