import { formatUnits } from "viem";
import type { Address, PublicClient } from "viem";
import type { TokensInfo } from "@/helpers/stake/types";
import type { ChainConfig } from "@/configs/stake/magicKlpConfig";
import { ONE_ETHER_VIEM, RANDOM_ACCOUNT } from "@/constants/global";

export const getTokensInfo = async (
  address: Address,
  config: ChainConfig,
  publicClient: PublicClient
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

  const aum: bigint = (aums.result as bigint[])[0];
  const klpSupply: bigint = (tokenBalancesWithSupplies.result as bigint[])[1];

  const stakeTokenPrice = (aum * 1000000n) / klpSupply;

  const mainTokenPrice =
    (stakeTokenPrice * (tokensRate.result as bigint)) / ONE_ETHER_VIEM;

  const totalSupplyUsd =
    ((totalSupply.result as bigint) * mainTokenPrice) / ONE_ETHER_VIEM;
  const mainTokenBalanceUsd =
    ((userMainTokenBalance.result as bigint) * mainTokenPrice) / ONE_ETHER_VIEM;

  const stakeTokenBalanceUsd =
    ((userStakeTokenBalance.result as bigint) * stakeTokenPrice) /
    ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: mainToken.name,
      icon: mainToken.icon,
      rateIcon: mainToken.rateIcon,
      decimals: mainToken.decimals,
      price: mainTokenPrice,
      rate: tokensRate.result as bigint,
      totalSupply: totalSupply.result as bigint,
      totalSupplyUsd,
      balance: userMainTokenBalance.result as bigint,
      balanceUsd: mainTokenBalanceUsd,
      contract: mainToken.contract,
    },
    stakeToken: {
      name: stakeToken.name,
      icon: stakeToken.icon,
      decimals: mainToken.decimals,
      price: stakeTokenPrice,
      approvedAmount: allowanceAmount.result as bigint,
      balance: userStakeTokenBalance.result as bigint,
      balanceUsd: stakeTokenBalanceUsd,
      contract: stakeToken.contract,
      lastAdded: formatUnits(lastAdded.result as bigint, 0),
    },
  };
};
