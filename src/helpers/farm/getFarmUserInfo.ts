import { getAccount, multicall, readContract } from "@wagmi/core";
import { getTokenPriceByAddress } from "@/helpers/priceHelper.js";
import { tokenAddresses } from "@/helpers/farm/createFarmItemConfig";
import type { FarmAccountInfo, FarmItem } from "@/utils/farmsConfig/types";

import { formatUnits } from "viem";

type UserInfo = {
  amount: string;
  rewardDebt: string;
  remainingIceTokenReward: string;
};

export const getFarmUserInfo = async (
  farmItemConfig: FarmItem
): Promise<FarmAccountInfo> => {
  const account = await getAccount().address;

  const [accountBalance, allowance, userInfo, userReward]: any =
    await multicall({
      contracts: [
        {
          ...farmItemConfig.stakingToken.contractInfo,
          functionName: "balanceOf",
          args: [account!],
        },
        {
          ...farmItemConfig.stakingToken.contractInfo,
          functionName: "allowance",
          args: [account!, farmItemConfig.contractInfo.address],
        },
        {
          ...farmItemConfig.contractInfo,
          functionName: "userInfo",
          args: [farmItemConfig.poolId, account!],
        },
        {
          ...farmItemConfig.contractInfo,
          functionName: "pendingIce",
          args: [farmItemConfig.poolId, account!],
        },
      ],
    });

  const userInfoParsed = await getUserInfo(userInfo.result);

  const tokensBalanceInfo = farmItemConfig.depositedBalance
    ? await getSLPBalances(farmItemConfig, userInfoParsed)
    : null;

  return {
    allowance: formatUnits(allowance.result, 18),
    userInfo: userInfoParsed,
    userReward: formatUnits(userReward.result, 18),
    tokensBalanceInfo,
    balance: formatUnits(accountBalance.result, 18),
    depositedBalance: userInfoParsed.amount,
  };
};

const getSLPBalances = async (farmItemConfig: FarmItem, userInfo: UserInfo) => {
  const reserves: any = await readContract({
    ...farmItemConfig.stakingToken.contractInfo,
    functionName: "getReserves",
    args: [],
  });

  //MIM or SPELL
  const token0Price = await getTokenPriceByAddress(
    1,
    tokenAddresses[
      farmItemConfig.depositedBalance?.token0
        .name as keyof typeof tokenAddresses
    ]
  );

  // ETH always
  const token1Price = await getTokenPriceByAddress(
    1,
    tokenAddresses["WETH" as keyof typeof tokenAddresses]
  );

  const token0Amount: number = Number(formatUnits(reserves[0], 18));

  const token1Amount: number = Number(formatUnits(reserves[1], 18));

  const token0Usd = token0Amount * token0Price;
  const token1Usd = token1Amount * token1Price;

  const tokensSum = token0Usd + token1Usd;

  const token0Percent = (token0Usd / tokensSum) * 100;
  const token1Percent = (token1Usd / tokensSum) * 100;

  const userRewardParsed: number = Number(userInfo.amount);

  const userRewardInUsd = userRewardParsed * farmItemConfig.lpPrice;

  const token0UserAmount =
    ((userRewardInUsd / 100) * token0Percent) / token0Price;
  const token1UserAmount =
    ((userRewardInUsd / 100) * token1Percent) / token1Price;

  return {
    token0: {
      name: farmItemConfig.depositedBalance?.token0.name,
      amount: token0UserAmount,
      amountInUsd: token0UserAmount * token0Price,
    },
    token1: {
      name: farmItemConfig.depositedBalance?.token1.name,
      amount: token1UserAmount,
      amountInUsd: token1UserAmount * token1Price,
    },
  };
};

const getUserInfo = async (userInfo: any): Promise<UserInfo> => {
  const [amountBigInt, rewardDebtBigInt, remainingIceTokenRewardBigInt] =
    userInfo;

  return {
    amount: formatUnits(amountBigInt, 18),
    remainingIceTokenReward: formatUnits(remainingIceTokenRewardBigInt, 18),
    rewardDebt: formatUnits(rewardDebtBigInt, 18),
  };
};
