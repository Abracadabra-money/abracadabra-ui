import { readContract } from "@wagmi/core";

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
  1: {
    address: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46", // cvxtricrypto2
    abi: abi1,
  },
  2: {
    address: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B", // cvx3Pool
    abi: abi2,
  },
};

export const getCurveWithdrawOneCoinAmount = async (
  collateralAmount,
  poolId = 1,
  tokenIndex = 0
) => {
  const poolContract = curvePools[poolId];

  const sellAmount = await readContract({
    address: poolContract.address,
    abi: poolContract.abi,
    functionName: "calc_withdraw_one_coin",
    args: [collateralAmount, tokenIndex],
  });

  return sellAmount;
};
