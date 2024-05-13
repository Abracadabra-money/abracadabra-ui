import { getPublicClient } from "@/helpers/chains/getChainsInfo";

const abi2 = [
  {
    name: "calc_withdraw_one_coin",
    outputs: [{ type: "uint256" }],
    inputs: [{ type: "uint256" }, { type: "int128" }],
    stateMutability: "view",
    type: "function",
  },
];

const abi1 = [
  {
    name: "calc_withdraw_one_coin",
    outputs: [{ type: "uint256" }],
    inputs: [{ type: "uint256" }, { type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// TODO: set cauldrons ids
const curvePools = {
  16: {
    address: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46", // cvxtricrypto2
    abi: abi1,
    usdtIndex: 0,
  },
  25: {
    address: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7", // cvx3Pool
    abi: abi2,
    usdtIndex: 2,
  },
};

export const getCurveWithdrawOneCoinAmount = async (
  collateralAmount,
  poolId,
  chainId
) => {
  const poolInfo = curvePools[poolId];
  const publicClient = getPublicClient(chainId);

  return await publicClient.readContract({
    address: poolInfo.address,
    abi: poolInfo.abi,
    functionName: "calc_withdraw_one_coin",
    args: [collateralAmount, poolInfo.usdtIndex],
  });
};
