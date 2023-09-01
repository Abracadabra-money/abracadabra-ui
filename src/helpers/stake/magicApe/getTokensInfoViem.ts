import { multicall } from "@wagmi/core";
import type { Address } from "@wagmi/core";
import { ONE_ETHER_VIEM, MIM_PRICE } from "@/constants/global";
import type { TokensInfo } from "@/types/magicApe/tokensInfo";

export const getTokensInfoViem = async (
  account: Address,
  config: any
): Promise<TokensInfo> => {
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
  console.log("balances", userApeBalance, userMagicApeBalance);

  const userApeBalanceUsd = (userApeBalance.result * apePrice) / ONE_ETHER_VIEM;

  const userMagicApeBalanceUsd =
    (userMagicApeBalance.result * magicApePrice) / ONE_ETHER_VIEM;

  const totalSupplyUsd = (totalSupply.result * magicApePrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: config.mainToken.name,
      icon: config.mainToken.icon,
      rateIcon: config.mainToken.rateIcon,
      decimals: config.mainToken.decimals,
      rate: tokensRate.result,
      price: magicApePrice,
      totalSupply: totalSupply.result,
      totalSupplyUsd,
      balanceUsd: userMagicApeBalanceUsd,
      balance: userMagicApeBalance.result,
    },
    stakeToken: {
      name: config.stakeToken.name,
      icon: config.stakeToken.icon,
      price: apePrice,
      decimals: config.stakeToken.decimals,
      balance: userApeBalance.result,
      balanceUsd: userApeBalanceUsd,
      approvedAmount: allowanceAmount.result,
    },
    tokensRate: tokensRate.result,
  };
};
