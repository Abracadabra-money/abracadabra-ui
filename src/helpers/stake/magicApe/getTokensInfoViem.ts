import { multicall } from "@wagmi/core";
import type { Address } from "@wagmi/core";
import { ONE_ETHER_VIEM, MIM_PRICE } from "@/constants/global";

export const getTokensInfoViem = async (account: Address, config: any) => {
  const { mainToken, stakeToken, oracle } = config;

  const [
    peekSpot,
    userApeBalance,
    userMagicApeBalance,
    allowanceAmount,
    totalSupply,
    tokensRate,
  ]: any = await multicall({
    contracts: [
      {
        ...oracle,
        functionName: "peekSpot",
        args: ["0x"],
      },
      {
        ...stakeToken.contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...mainToken.contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...stakeToken.contract,
        functionName: "allowance",
        args: [account, mainToken.contract.address],
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
    ],
  });

  const apePrice = (MIM_PRICE * ONE_ETHER_VIEM) / peekSpot.result;
  const magicApePrice = (apePrice * tokensRate.result) / ONE_ETHER_VIEM;

  const userApeBalanceUsd = (userApeBalance.result * apePrice) / ONE_ETHER_VIEM;

  const userMagicApeBalanceUsd =
    (userMagicApeBalance.result * magicApePrice) / ONE_ETHER_VIEM;

  const totalSupplyUsd = (totalSupply.result * magicApePrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      icon: config.mainToken.icon,
      name: config.mainToken.name,
      rateIcon: config.mainToken.rateIcon,
      price: magicApePrice,
      balance: userMagicApeBalance.result,
      balanceUsd: userMagicApeBalanceUsd,
      totalSupply: totalSupply.result,
      totalSupplyUsd,
      rate: tokensRate.result,
      decimals: config.mainToken.decimals,
    },
    stakeToken: {
      icon: config.stakeToken.icon,
      name: config.stakeToken.name,
      price: apePrice,
      balance: userApeBalance.result,
      approvedAmount: allowanceAmount.result,
      balanceUsd: userApeBalanceUsd,
      decimals: config.stakeToken.decimals,
    },
    tokensRate: tokensRate.result,
  };
};
