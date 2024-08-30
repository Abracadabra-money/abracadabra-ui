import type { Address, PublicClient } from "viem";
import type { TokensInfo } from "@/helpers/stake/types";
import { ONE_ETHER_VIEM, MIM_PRICE } from "@/constants/global";
import type { MagicApeConfig } from "@/configs/stake/magicApeConfig";

export const getTokensInfo = async (
  account: Address | undefined,
  config: MagicApeConfig,
  publicClient: PublicClient
): Promise<TokensInfo> => {
  const { mainToken, stakeToken, oracle } = config;

  let allowanceAmountResult = 0n;
  let userApeBalanceResult = 0n;
  let userMagicApeBalanceResult = 0n;
  let userApeBalanceUsd = 0n;
  let userMagicApeBalanceUsd = 0n;

  const [peekSpot, totalSupply, tokensRate] = await publicClient.multicall({
    contracts: [
      {
        ...oracle,
        functionName: "peekSpot",
        args: ["0x"],
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

  const apePrice = (MIM_PRICE * ONE_ETHER_VIEM) / (peekSpot.result as bigint);
  const magicApePrice =
    (apePrice * (tokensRate.result as bigint)) / ONE_ETHER_VIEM;

  if (account) {
    const [userApeBalance, userMagicApeBalance, allowanceAmount] =
      await publicClient.multicall({
        contracts: [
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
        ],
      });

    allowanceAmountResult = allowanceAmount.result as bigint;
    userApeBalanceResult = userApeBalance.result as bigint;
    userMagicApeBalanceResult = userMagicApeBalance.result as bigint;
    userApeBalanceUsd =
      ((userApeBalance.result as bigint) * apePrice) / ONE_ETHER_VIEM;
    userMagicApeBalanceUsd =
      ((userMagicApeBalance.result as bigint) * magicApePrice) / ONE_ETHER_VIEM;
  }

  const totalSupplyUsd =
    ((totalSupply.result as bigint) * magicApePrice) / ONE_ETHER_VIEM;

  return {
    mainToken: {
      name: config.mainToken.name,
      icon: config.mainToken.icon,
      contract: mainToken.contract,
      rateIcon: config.mainToken.rateIcon,
      decimals: config.mainToken.decimals,
      rate: tokensRate.result as bigint,
      price: magicApePrice,
      totalSupply: totalSupply.result as bigint,
      totalSupplyUsd,
      balanceUsd: userMagicApeBalanceUsd,
      balance: userMagicApeBalanceResult,
    },
    stakeToken: {
      name: config.stakeToken.name,
      icon: config.stakeToken.icon,
      contract: stakeToken.contract,
      price: apePrice,
      decimals: config.stakeToken.decimals,
      balance: userApeBalanceResult,
      balanceUsd: userApeBalanceUsd,
      approvedAmount: allowanceAmountResult,
    },
  };
};
