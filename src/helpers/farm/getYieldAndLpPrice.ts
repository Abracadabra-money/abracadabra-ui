import { ethers } from "ethers";
import erc20Abi from "@/utils/farmPools/abi/erc20Abi";
import { getTokenPriceByAddress } from "@/helpers/priceHelper.js";
import { getNetwork } from "@wagmi/core";

import type { Contract } from "ethers";
import type { FarmConfig } from "@/utils/farmsConfig/types";

const MIMAddress = "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3";
const SPELLAddress = "0x090185f2135308bad17527004364ebcc2d37e5f6";

export const getYieldAndLpPrice = async (
  stakingTokenContract: Contract,
  contractInstance: Contract,
  poolInfo: any,
  farmPoolInfo: FarmConfig,
  signer: any
) => {
  const chainId = await getNetwork().chain?.id;

  if (farmPoolInfo.id === 1 || farmPoolInfo.id === 2) {
    const mimPrice = await getTokenPriceByAddress(chainId, MIMAddress);
    const spellPrice = await getTokenPriceByAddress(chainId, SPELLAddress);

    const mimTokenContract = new ethers.Contract(
      MIMAddress,
      JSON.stringify(erc20Abi),
      signer
    );

    const spellTokenContract = new ethers.Contract(
      SPELLAddress,
      JSON.stringify(erc20Abi),
      signer
    );

    const lpYieldAndPrice = await getLPYield(
      poolInfo.stakingToken,
      farmPoolInfo.id === 1 ? mimTokenContract : spellTokenContract,
      stakingTokenContract,
      farmPoolInfo.id === 1 ? mimPrice : spellPrice
    );

    const poolYield = await getYield(
      contractInstance,
      lpYieldAndPrice?.lpYield,
      poolInfo.stakingTokenTotalAmount,
      poolInfo.allocPoint,
      poolInfo.accIcePerShare
    );

    return {
      lpPrice: lpYieldAndPrice?.lpPrice,
      poolYield,
    };
  }

  if (farmPoolInfo.id === 3) {
    try {
      const price = await stakingTokenContract.get_virtual_price();

      const lpPrice = ethers.utils.formatEther(price.toString());
      const poolYield = await getYield(
        contractInstance,
        1000,
        poolInfo.stakingTokenTotalAmount,
        poolInfo.allocPoint,
        poolInfo.accIcePerShare
      );

      return {
        lpPrice,
        poolYield,
      };
    } catch (e) {
      console.log("get price err:", e);

      return {
        lpPrice: 0,
        poolYield: 0,
      };
    }
  }

  return {
    lpPrice: 0,
    poolYield: 0,
  };
};

const getYield = async (
  contractInstance: Contract,
  amount = 1000,
  stakingTokenTotalAmount: any,
  allocPoint: any,
  accIcePerShare: any
) => {
  try {
    const divide =
      +ethers.utils.formatEther(stakingTokenTotalAmount.toString()) + amount;

    const multiplier = 86400;

    const icePerSecondResp = await contractInstance.icePerSecond();
    const icePerSecond = +icePerSecondResp;

    const totalAllocPointResp = await contractInstance.totalAllocPoint();
    const totalAllocPoint = +totalAllocPointResp;

    let iceReward =
      (+multiplier * +icePerSecond * +allocPoint) / +totalAllocPoint;

    let loacalAccIcePerShare =
      +accIcePerShare + (+iceReward * Math.pow(10, 12)) / +divide;

    const accIcePerShareConst =
      +loacalAccIcePerShare + (+iceReward * Math.pow(10, 12)) / +divide;

    const rewardDebt = (+amount * +loacalAccIcePerShare) / Math.pow(10, 12);

    const pending =
      (+amount * +accIcePerShareConst) / Math.pow(10, 12) - +rewardDebt;

    return ethers.utils.formatUnits(
      pending.toLocaleString("fullwide", { useGrouping: false })
    );
  } catch (error) {
    console.log("getYield", error);
    return 0;
  }
};

const getLPYield = async (
  stakingToken: any,
  iceInstance: any,
  erc20: any,
  tokenPrice: any
) => {
  try {
    let IceInSlpTotal = await iceInstance.balanceOf(stakingToken);
    let totalTokensSLPMinted = await erc20.totalSupply();

    let icePerLp: any;
    if (+IceInSlpTotal > 0) {
      icePerLp = +totalTokensSLPMinted / +IceInSlpTotal;
    }
    if (+IceInSlpTotal === 0) {
      icePerLp = 0;
    }
    const lpPrice = (+IceInSlpTotal / +totalTokensSLPMinted) * +tokenPrice * 2;

    let IcePer1000Bucks: any;
    if (+tokenPrice > 0) IcePer1000Bucks = 1000 / +tokenPrice;
    if (+tokenPrice === 0) IcePer1000Bucks = 0;

    let res = (+IcePer1000Bucks! * +icePerLp!) / 2; // for LP pool
    return { lpYield: res, lpPrice };
  } catch (error) {
    console.log(error);
  }
};
