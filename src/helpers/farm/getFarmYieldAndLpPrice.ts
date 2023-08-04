import { ethers } from "ethers";
import erc20Abi from "@/utils/farmPools/abi/erc20Abi";

import type { Contract } from "ethers";
import type { FarmConfig } from "@/utils/farmsConfig/types";

const MIMAddress = "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3";
const SPELLAddress = "0x090185f2135308bad17527004364ebcc2d37e5f6";

export const getFarmYieldAndLpPrice = async (
  stakingTokenContract: Contract,
  contractInstance: Contract,
  poolInfo: any,
  farmInfo: FarmConfig,
  signer: any,
  mimPrice: any,
  spellPrice: any
) => {
  if (farmInfo.id === 1 || farmInfo.id === 2) {
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

    const lpYieldAndPrice = await getLPYieldAndPrice(
      poolInfo.stakingToken,
      farmInfo.id === 1 ? mimTokenContract : spellTokenContract,
      stakingTokenContract,
      farmInfo.id === 1 ? mimPrice : spellPrice
    );

    const farmYield = await getFarmYield(
      contractInstance,
      lpYieldAndPrice?.lpYield,
      poolInfo.stakingTokenTotalAmount,
      poolInfo.allocPoint,
      poolInfo.accIcePerShare
    );

    return {
      lpPrice: lpYieldAndPrice?.lpPrice,
      farmYield,
    };
  }

  if (farmInfo.id === 3) {
    try {
      const price = await stakingTokenContract.get_virtual_price();

      const lpPrice = ethers.utils.formatEther(price.toString());
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
  }

  return {
    lpPrice: 0,
    farmYield: 0,
  };
};

const getFarmYield = async (
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

    const icePerSecond = await contractInstance.icePerSecond();

    const totalAllocPoint = await contractInstance.totalAllocPoint();

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
    console.log("getFarmYield", error);
    return 0;
  }
};

const getLPYieldAndPrice = async (
  stakingToken: any,
  iceInstance: any,
  erc20: any,
  tokenPrice: any
) => {
  try {
    let IceInSlpTotal = await iceInstance.balanceOf(stakingToken);
    let totalTokensSLPMinted = await erc20.totalSupply();

    let icePerLp = 0;
    if (+IceInSlpTotal > 0) icePerLp = +totalTokensSLPMinted / +IceInSlpTotal;

    const lpPrice = (+IceInSlpTotal / +totalTokensSLPMinted) * +tokenPrice * 2;

    let IcePer1000Bucks = 0;
    if (+tokenPrice > 0) IcePer1000Bucks = 1000 / +tokenPrice;

    let res = (+IcePer1000Bucks * +icePerLp) / 2; // for LP pool
    return { lpYield: res, lpPrice };
  } catch (error) {
    console.log(error);
  }
};
