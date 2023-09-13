import { erc20ABI } from "@wagmi/core";
import { multicall, readContract } from "@wagmi/core";
import { formatUnits, parseUnits } from "viem";
import { ONE_ETHER_VIEM } from "@/constants/global";
import type { Address } from "@wagmi/core";
import type {
  FarmConfig,
  PoolInfo,
  ContractInfo,
} from "@/utils/farmsConfig/types";

const MIMAddress = "0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3";
const SPELLAddress = "0x090185f2135308bad17527004364ebcc2d37e5f6";

export const getFarmYieldAndLpPrice = async (
  stakingTokenContractInfo: ContractInfo,
  contractInfo: ContractInfo,
  poolInfo: PoolInfo,
  farmInfo: FarmConfig,
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

      const lpYieldAndPrice = await getLPYieldAndPrice(
        stakingTokenContractInfo,
        tokenAddress,
        tokenPrice
      );

      const farmYield = await getFarmYield(
        contractInfo,
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

    const price = await readContract({
      address: stakingTokenContractInfo.address,
      abi: stakingTokenContractInfo.abi,
      functionName: "get_virtual_price",
      args: [],
    });

    const lpPrice = Number(formatUnits(price, 18));

    const farmYield = await getFarmYield(
      contractInfo,
      1000n,
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
  contractInfo: ContractInfo,
  amount = 1000n,
  stakingTokenTotalAmount: bigint,
  allocPoint: number,
  accIcePerShare: bigint
) => {
  try {
    const [icePerSecond, totalAllocPoint]: any = await multicall({
      contracts: [
        {
          address: contractInfo.address,
          abi: contractInfo.abi,
          functionName: "icePerSecond",
          args: [],
        },
        {
          address: contractInfo.address,
          abi: contractInfo.abi,
          functionName: "totalAllocPoint",
          args: [],
        },
      ],
    });

    const parsedAmount = amount / BigInt(1e18);

    const divide = stakingTokenTotalAmount + parsedAmount;

    const multiplier = 86400n;

    const parsedAllocPoint = BigInt(allocPoint);

    let iceReward =
      (multiplier * icePerSecond.result * parsedAllocPoint) /
      totalAllocPoint.result;

    const power = BigInt(Math.pow(10, 30));

    let loacalAccIcePerShare = accIcePerShare + (iceReward * power) / divide;

    const accIcePerShareConst =
      loacalAccIcePerShare + (iceReward * power) / divide;

    const rewardDebt = (parsedAmount * loacalAccIcePerShare) / power;

    const pending = (parsedAmount * accIcePerShareConst) / power - rewardDebt;

    return Number(formatUnits(pending, 18));
  } catch (error) {
    console.log("getFarmYield", error);
    return 0;
  }
};

const getLPYieldAndPrice = async (
  stakingTokenContractInfo: ContractInfo,
  iceTokenAddress: Address,
  tokenPrice: number
) => {
  try {
    let [IceInSlpTotal, totalTokensSLPMinted]: any = await multicall({
      contracts: [
        {
          address: iceTokenAddress,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [stakingTokenContractInfo.address],
        },
        {
          address: stakingTokenContractInfo.address,
          abi: stakingTokenContractInfo.abi,
          functionName: "totalSupply",
          args: [],
        },
      ],
    });

    let icePerLp = 0n;
    if (IceInSlpTotal.result > 0n)
      icePerLp =
        (totalTokensSLPMinted.result * ONE_ETHER_VIEM) / IceInSlpTotal.result;

    let parsedTokenPrice = parseUnits((tokenPrice * 2).toString(), 18);

    const lpPrice =
      ((IceInSlpTotal.result / totalTokensSLPMinted.result) *
        parsedTokenPrice) /
      ONE_ETHER_VIEM;

    let IcePer1000Bucks = 0;
    if (tokenPrice > 0) IcePer1000Bucks = 1000 / tokenPrice;

    let parsedIcePer1000Bucks = parseUnits(IcePer1000Bucks.toString(), 18);

    let res = (parsedIcePer1000Bucks * icePerLp) / 2n; // for LP pool

    return { lpYield: res, lpPrice };
  } catch (error) {
    console.log(error);
  }
};
