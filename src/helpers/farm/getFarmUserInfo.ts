import { BigNumber, ethers } from "ethers";
import { getAccount } from "@wagmi/core";
import { getTokenPriceByAddress } from "@/helpers/priceHelper.js";
import { tokenAddresses } from "@/helpers/farm/createFarmItemConfig";
import type { FarmAccountInfo, FarmItem } from "@/utils/farmsConfig/types";

type UserInfo = {
  amount: BigNumber;
  rewardDebt: BigNumber;
  remainingIceTokenReward: BigNumber;
};

export const getFarmUserInfo = async (
  farmItemConfig: FarmItem
): Promise<FarmAccountInfo> => {
  const account = await getAccount().address;

  const allowance = await farmItemConfig.stakingToken.contract.allowance(
    account,
    farmItemConfig.contractInstance.address
  );

  const userInfo: UserInfo = await farmItemConfig.contractInstance.userInfo(
    farmItemConfig.farmId,
    account
  );

  const userReward = await farmItemConfig.contractInstance.pendingIce(
    farmItemConfig.farmId,
    account
  );

  const tokensBalanceInfo = farmItemConfig.depositedBalance
    ? await getSLPBalances(farmItemConfig, userInfo)
    : null;

  const accountBalance = await farmItemConfig.stakingToken.contract.balanceOf(
    account
  );

  const balance = ethers.utils.formatEther(accountBalance.toString());

  const deposited = await farmItemConfig.contractInstance.userInfo(
    farmItemConfig.farmId,
    account
  );

  const depositedBalance = ethers.utils.formatEther(
    deposited?.amount.toString()
  );

  return {
    allowance,
    userInfo,
    userReward,
    tokensBalanceInfo,
    balance,
    depositedBalance,
  };
};

const getSLPBalances = async (farmItemConfig: FarmItem, userInfo: UserInfo) => {
  const { _reserve0, _reserve1 } =
    await farmItemConfig.stakingToken.contract.getReserves();

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

  const token0Amount: number = Number(ethers.utils.formatUnits(_reserve0, 18));

  const token1Amount: number = Number(ethers.utils.formatUnits(_reserve1, 18));

  const token0Usd = token0Amount * token0Price;
  const token1Usd = token1Amount * token1Price;

  const tokensSum = token0Usd + token1Usd;

  const token0Percent = (token0Usd / tokensSum) * 100;
  const token1Percent = (token1Usd / tokensSum) * 100;

  const userRewardParsed: number = Number(
    ethers.utils.formatUnits(userInfo.amount, 18)
  );

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
