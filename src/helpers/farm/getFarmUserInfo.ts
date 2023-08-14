import { ethers } from "ethers";
import { getAccount } from "@wagmi/core";
import { getTokenPriceByAddress } from "@/helpers/priceHelper.js";

const tokenAddresses = {
  SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
  MIM: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const getFarmUserInfo = async (farmItemConfig: any) => {
  const account = await getAccount().address;

  const allowance = await farmItemConfig.stakingToken.contract.allowance(
    account,
    farmItemConfig.contractInstance.address
  );

  const userInfo = await farmItemConfig.contractInstance.userInfo(
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

const getSLPBalances = async (farmItemConfig: any, userInfo: any) => {
  const { _reserve0, _reserve1 } =
    await farmItemConfig.stakingToken.contract.getReserves();

  //MIM or SPELL
  const token0Price = await getTokenPriceByAddress(
    1,
    tokenAddresses[
      farmItemConfig.depositedBalance.token0.name as keyof typeof tokenAddresses
    ]
  );

  // ETH always
  const token1Price = await getTokenPriceByAddress(
    1,
    tokenAddresses["WETH" as keyof typeof tokenAddresses]
  );

  const token0Amount: any = ethers.utils.formatUnits(_reserve0, 18);

  const token1Amount: any = ethers.utils.formatUnits(_reserve1, 18);

  const token0Usd = token0Amount * token0Price;
  const token1Usd = token1Amount * token1Price;

  const tokensSum = token0Usd + token1Usd;

  const token0Percent = (token0Usd / tokensSum) * 100;
  const token1Percent = (token1Usd / tokensSum) * 100;

  const userRewardParsed: any = ethers.utils.formatUnits(userInfo.amount, 18);

  const userRewardInUsd = userRewardParsed * farmItemConfig.lpPrice;

  const token0UserAmount =
    ((userRewardInUsd / 100) * token0Percent) / token0Price;
  const token1UserAmount =
    ((userRewardInUsd / 100) * token1Percent) / token1Price;

  return {
    token0: {
      name: farmItemConfig.depositedBalance.token0.name,
      amount: +token0UserAmount,
      amountInUsd: +token0UserAmount * +token0Price,
    },
    token1: {
      name: farmItemConfig.depositedBalance.token1.name,
      amount: +token1UserAmount,
      amountInUsd: +token1UserAmount * +token1Price,
    },
  };
};
