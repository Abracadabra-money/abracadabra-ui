import { ONE_ETHER_VIEM } from "@/constants/global";
import { multicall } from "@wagmi/core";
import type { Address } from "@wagmi/core";
// import { ONE_ETHER_VIEM, MIM_PRICE } from "@/constants/global";

export const getTokensInfo = async (address: Address, config: any) => {
  const { mainToken, stakeToken } = config;

  const [
    userMainTokenBalance,
    totalSupply,
    tokensRate,
    userStakeTokenBalance,
    allowanceAmount,
  ]: any = await multicall({
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
        ...mainToken.contract,
        functionName: "convertToAssets",
        args: [ONE_ETHER_VIEM],
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
    ],
  });

  // const mainTokenPrice =
  //   (MIM_PRICE * ONE_ETHER_VIEM) / oracleExchangeRate.result;

  // const stakeTokenPrice = (mainTokenPrice * ONE_ETHER_VIEM) / tokenRate;

  // const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;
  // const mainTokenBalanceUsd =
  //   (userMainTokenBalance.result * mainTokenPrice) / ONE_ETHER_VIEM;

  // const stakeTokenBalanceUsd =
  //   (userStakeTokenBalance.result * stakeTokenPrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: mainToken.name,
      icon: mainToken.icon,
      rateIcon: mainToken.rateIcon,
      decimals: mainToken.decimals,
      // price: mainTokenPrice,
      rate: 1000000000000000000n,
      totalSupply: totalSupply.result,
      // totalSupplyUsd,
      balance: userMainTokenBalance.result,
      // balanceUsd: mainTokenBalanceUsd,
      approvedAmount: allowanceAmount.result,
      contract: mainToken.contract,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      decimals: mainToken.decimals,
      // price: stakeTokenPrice,
      balance: userStakeTokenBalance.result,
      // balanceUsd: stakeTokenBalanceUsd,
      contract: stakeToken.contract,
    },
  };
};
