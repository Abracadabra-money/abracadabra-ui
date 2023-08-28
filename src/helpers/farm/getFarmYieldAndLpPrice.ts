import { ethers } from "ethers";
import erc20Abi from "@/utils/farmPools/abi/erc20Abi";

import type { BigNumber, Contract, Signer } from "ethers";
import type { FarmConfig, PoolInfo } from "@/utils/farmsConfig/types";

const MIMAddress = "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3";
const SPELLAddress = "0x090185f2135308bad17527004364ebcc2d37e5f6";

export const getFarmYieldAndLpPrice = async (
  stakingTokenContract: Contract,
  contractInstance: Contract,
  poolInfo: PoolInfo,
  farmInfo: FarmConfig,
  signer: Signer,
  mimPrice: number,
  spellPrice: number
) => {
  try {
    if (farmInfo.depositedBalance) {
      const tokenAddress =
        farmInfo.depositedBalance.token0.name === "MIM"
          ? MIMAddress
          : SPELLAddress;

      const tokenPrice =
        farmInfo.depositedBalance.token0.name === "MIM" ? mimPrice : spellPrice;

      const tokenContract = new ethers.Contract(
        tokenAddress,
        JSON.stringify(erc20Abi),
        signer
      );

      const lpYieldAndPrice = await getLPYieldAndPrice(
        poolInfo.stakingToken,
        tokenContract,
        stakingTokenContract,
        tokenPrice
      );

      const farmYield = await getFarmYield(
        contractInstance,
        lpYieldAndPrice?.lpYield,
        poolInfo.stakingTokenTotalAmount,
        poolInfo.allocPoint,
        poolInfo.accIcePerShare
      );

      return {
        lpPrice: Number(lpYieldAndPrice?.lpPrice),
        farmYield,
      };
    }

    const price = await stakingTokenContract.get_virtual_price();

    const lpPrice = Number(ethers.utils.formatEther(price));
    const farmYield = await getFarmYield(
      contractInstance,
      1000,
      poolInfo.stakingTokenTotalAmount,
      poolInfo.allocPoint,
      poolInfo.accIcePerShare
    );

    return {
      lpPrice,
      farmYield,
    };
  } catch (e) {
    console.log("get price err:", e);

    return {
      lpPrice: 0,
      farmYield: 0,
    };
  }
};

const getFarmYield = async (
  contractInstance: Contract,
  amount = 1000,
  stakingTokenTotalAmount: BigNumber,
  allocPoint: number,
  accIcePerShare: BigNumber
) => {
  try {
    const divide =
      Number(ethers.utils.formatEther(stakingTokenTotalAmount)) + amount;

    const multiplier = 86400;

    const icePerSecond = await contractInstance.icePerSecond();

    const totalAllocPoint = await contractInstance.totalAllocPoint();

    let iceReward = (multiplier * icePerSecond * allocPoint) / totalAllocPoint;

    let loacalAccIcePerShare =
      Number(accIcePerShare) + (iceReward * Math.pow(10, 12)) / divide;

    const accIcePerShareConst =
      loacalAccIcePerShare + (iceReward * Math.pow(10, 12)) / divide;

    const rewardDebt = (amount * loacalAccIcePerShare) / Math.pow(10, 12);

    const pending =
      (amount * accIcePerShareConst) / Math.pow(10, 12) - rewardDebt;

    return Number(
      ethers.utils.formatUnits(
        pending.toLocaleString("fullwide", { useGrouping: false })
      )
    );
  } catch (error) {
    console.log("getFarmYield", error);
    return 0;
  }
};

const getLPYieldAndPrice = async (
  stakingToken: string,
  iceInstance: Contract,
  stakingTokenContract: Contract,
  tokenPrice: number
) => {
  try {
    let IceInSlpTotal = await iceInstance.balanceOf(stakingToken);
    let totalTokensSLPMinted = await stakingTokenContract.totalSupply();

    let icePerLp = 0;
    if (IceInSlpTotal > 0) icePerLp = totalTokensSLPMinted / IceInSlpTotal;

    const lpPrice = (IceInSlpTotal / totalTokensSLPMinted) * tokenPrice * 2;

    let IcePer1000Bucks = 0;
    if (tokenPrice > 0) IcePer1000Bucks = 1000 / tokenPrice;

    let res = (IcePer1000Bucks * icePerLp) / 2; // for LP pool
    return { lpYield: res, lpPrice };
  } catch (error) {
    console.log(error);
  }
};
