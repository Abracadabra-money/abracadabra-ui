import {
  type Address,
  keccak256,
  type PublicClient,
  encodePacked,
  pad,
  numberToHex,
  encodeAbiParameters,
  hexToBigInt,
  parseAbiParameters,
} from "viem";

import {
  ISLAND_ROUTER_ADDRESS,
  BERA_HONEY_ADDRESS,
  BERA_MIM_ADDRESS,
} from "./constants";

import { BERA_CHAIN_ID } from "@/constants/global";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import IslandRouterAbi from "@/abis/IslandRouter";

import { getSolidityMappingSlot } from "@/helpers/getSolidityMappingSlot";

const addLiquidityPreview = async (
  token0Amount: bigint,
  token1Amount: bigint,
  lpAddress: Address,
  userAddress: Address,
  token0Address: Address = BERA_MIM_ADDRESS,
  token1Address: Address = BERA_HONEY_ADDRESS
) => {
  const mimSlotInfo = getMimSlotInfo(userAddress, ISLAND_ROUTER_ADDRESS);
  const honeySlotInfo = getHoneySlotInfo(userAddress, ISLAND_ROUTER_ADDRESS);

  const token0AmountSlotValue = numberToHex(token0Amount, { size: 32 });
  const token1AmountSlotValue = numberToHex(token1Amount, { size: 32 });

  const publicClient: PublicClient = getPublicClient(BERA_CHAIN_ID);
  try {
    const { result } = await publicClient.simulateContract({
      address: ISLAND_ROUTER_ADDRESS,
      abi: IslandRouterAbi,
      functionName: "addLiquidity",
      args: [
        lpAddress,
        token0Amount,
        token1Amount,
        token0Amount / 2n,
        token1Amount / 2n,
        0n,
        userAddress,
      ],
      account: userAddress,
      stateOverride: [
        {
          address: token0Address,
          stateDiff: [
            {
              slot: mimSlotInfo.balanceSlot,
              value: token0AmountSlotValue,
            },
            {
              slot: mimSlotInfo.allowanceSlot,
              value: token0AmountSlotValue,
            },
          ],
        },
        {
          address: token1Address,
          stateDiff: [
            {
              slot: honeySlotInfo.balanceSlot,
              value: token1AmountSlotValue,
            },
            {
              slot: honeySlotInfo.allowanceSlot,
              value: token1AmountSlotValue,
            },
          ],
        },
      ],
    });

    const addLiquidityResult = {
      amount0: result[0],
      amount1: result[1],
      mintAmount: result[2],
    };

    console.log("[addLiquidityPreview] simulation result:", addLiquidityResult);

    return addLiquidityResult;
  } catch (error) {
    console.log("[addLiquidityPreview] error:", error);
  }
};

const getHoneySlotInfo = (address: Address, spender: Address) => {
  const BALANCE_SLOT_SEED = "0x87a211a2";
  const ALLOWANCE_SLOT_SEED = "0x7f5e9f20";

  const balanceSlot = keccak256(
    encodePacked(
      ["address", "bytes"],
      [address, pad(BALANCE_SLOT_SEED, { size: 12 })]
    )
  );

  const allowanceSlot = keccak256(
    encodePacked(
      ["address", "bytes", "address"],
      [address, pad(ALLOWANCE_SLOT_SEED, { size: 12 }), spender]
    )
  );

  return { balanceSlot, allowanceSlot };
};

const getMimSlotInfo = (address: Address, spender: Address) => {
  const erc20StorageSlot = hexToBigInt(
    "0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00"
  );

  const userBalanceSlot = getSolidityMappingSlot({
    slot: erc20StorageSlot,
    params: parseAbiParameters("address"),
    values: [address],
  });

  const allowanceSlot = getSolidityMappingSlot({
    slot: erc20StorageSlot + 1n,
    params: parseAbiParameters("address, address"),
    values: [address, spender],
  });

  return {
    balanceSlot: userBalanceSlot,
    allowanceSlot: allowanceSlot,
  };
};

export default addLiquidityPreview;
