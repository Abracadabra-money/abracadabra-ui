import { multicall } from "@wagmi/core";
import type { Address } from "@wagmi/core";
import type { TokensInfo } from "@/types/magicKlp/tokensInfo";
import { ONE_ETHER_VIEM, RANDOM_ACCOUNT } from "@/constants/global";
import { formatUnits } from "viem";

export const getTokensInfo = async (
  address: Address,
  config: any
): Promise<TokensInfo> => {
  const { mainToken, stakeToken, manager, reader } = config;

  const [
    userMainTokenBalance,
    totalSupply,
    tokensRate,
    userStakeTokenBalance,
    allowanceAmount,
    aums,
    lastAdded,
    tokenBalancesWithSupplies,
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
      {
        ...manager.contract,
        functionName: "getAums",
        args: [],
      },
      {
        ...manager.contract,
        functionName: "lastAddedAt",
        args: [address],
      },
      {
        ...reader.contract,
        functionName: "getTokenBalancesWithSupplies",
        args: [RANDOM_ACCOUNT, [stakeToken.contract.address]],
      },
    ],
  });

  const aum = aums.result[0];
  const klpSupply = tokenBalancesWithSupplies.result[1];
  const stakeTokenPrice = (aum * 1000000n) / klpSupply;

  const mainTokenPrice = (stakeTokenPrice * tokensRate.result) / ONE_ETHER_VIEM;

  const totalSupplyUsd = (totalSupply.result * mainTokenPrice) / ONE_ETHER_VIEM;
  const mainTokenBalanceUsd =
    (userMainTokenBalance.result * mainTokenPrice) / ONE_ETHER_VIEM;

  const stakeTokenBalanceUsd =
    (userStakeTokenBalance.result * stakeTokenPrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: mainToken.name,
      icon: mainToken.icon,
      rateIcon: mainToken.rateIcon,
      decimals: mainToken.decimals,
      price: mainTokenPrice,
      rate: tokensRate.result,
      totalSupply: totalSupply.result,
      totalSupplyUsd,
      balance: userMainTokenBalance.result,
      balanceUsd: mainTokenBalanceUsd,
      approvedAmount: allowanceAmount.result,
      contract: mainToken.contract,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      decimals: mainToken.decimals,
      price: stakeTokenPrice,
      balance: userStakeTokenBalance.result,
      balanceUsd: stakeTokenBalanceUsd,
      contract: stakeToken.contract,
      lastAdded: formatUnits(lastAdded.result, 0),
    },
  };
};
