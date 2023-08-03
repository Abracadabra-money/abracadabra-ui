import { ethers } from "ethers";
import { getAccount, getNetwork } from "@wagmi/core";
import { getAllowance } from "@/helpers/farm/getAllowance";
import { getTokenPriceByAddress } from "@/helpers/priceHelper.js";

const tokenAddresses = {
  SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
  MIM: "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3",
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
};

export const getFarmUserInfo = async (farmPoolItem: any) => {
  const account = await getAccount().address;

  const allowance = await getAllowance(
    farmPoolItem.stakingTokenContract,
    farmPoolItem.contractInstance.address
  );

  const userInfo = await farmPoolItem.contractInstance.userInfo(
    farmPoolItem.poolId,
    account
  );

  const userReward = await farmPoolItem.contractInstance.pendingIce(
    farmPoolItem.poolId,
    account
  );

  const tokensBalanceInfo = farmPoolItem.depositedBalance
    ? await getSLPBalances(farmPoolItem, userInfo)
    : null;

  const accountBalance = await farmPoolItem.stakingTokenContract.balanceOf(
    account
  );

  const balance = ethers.utils.formatEther(accountBalance.toString());

  const deposited = await farmPoolItem.contractInstance.userInfo(
    farmPoolItem.poolId,
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

const getSLPBalances = async (farmPoolItem: any, userInfo: any) => {
  const chainId = await getNetwork().chain?.id;

  const { _reserve0, _reserve1 } =
    await farmPoolItem.stakingTokenContract.getReserves();

  //MIM or SPELL
  const token0Price = await getTokenPriceByAddress(
    chainId,
    tokenAddresses[
      //todo
      //create a type for token adresses
      farmPoolItem.depositedBalance.token0.name as keyof typeof tokenAddresses
    ]
  );

  // ETH always
  const token1Price = await getTokenPriceByAddress(
    chainId,
    //todo
    //create a type for token adresses
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

  const userRewardInUsd = userRewardParsed * farmPoolItem.lpPrice;

  const token0UserAmount =
    ((userRewardInUsd / 100) * token0Percent) / token0Price;
  const token1UserAmount =
    ((userRewardInUsd / 100) * token1Percent) / token1Price;

  return {
    token0: {
      name: farmPoolItem.depositedBalance.token0.name,
      amount: token0UserAmount,
      amountInUsd: token0UserAmount * token0Price,
    },
    token1: {
      name: farmPoolItem.depositedBalance.token1.name,
      amount: token1UserAmount,
      amountInUsd: token1UserAmount * token1Price,
    },
  };
};
