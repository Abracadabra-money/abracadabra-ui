import {
  type Address,
  keccak256,
  type PublicClient,
  encodePacked,
  type Hex,
  pad,
  numberToHex,
} from "viem";

import { ISLAND_ROUTER_ADDRESS } from "./constants";
import { BERA_CHAIN_ID } from "@/constants/global";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import IslandRouterAbi from "@/abis/IslandRouter";

const removeLiquidityPreview = async (
  lpAmount: bigint,
  lpAddress: Address,
  userAddress: Address
) => {
  const publicClient: PublicClient = getPublicClient(BERA_CHAIN_ID);
  const lpSlotInfo = getLpSlotInfo(userAddress, ISLAND_ROUTER_ADDRESS);
  const balanceSlotValue = numberToHex(lpAmount, { size: 32 });

  try {
    const { result: [amount0, amount1, liquidityBurned] } = await publicClient.simulateContract({
      address: ISLAND_ROUTER_ADDRESS,
      abi: IslandRouterAbi,
      functionName: "removeLiquidity",
      args: [lpAddress, lpAmount, 0n, 0n, userAddress],
      account: userAddress,
      stateOverride: [
        {
          address: lpAddress,
          stateDiff: [
            {
              slot: lpSlotInfo.balanceSlot,
              value: balanceSlotValue,
            },
            {
              slot: lpSlotInfo.allowanceSlot,
              value: balanceSlotValue,
            },
          ],
        },
      ],
    });

    const removeLiquidityResult = {
      amount0,
      amount1,
      liquidityBurned,
    };

    console.log(
      "[removeLiquidityPreview] simulation result:",
      removeLiquidityResult
    );

    return removeLiquidityResult;
  } catch (error) {
    console.log("[removeLiquidityPreview] error:", error);
  }
};

// notice: kodiak lp
const getLpSlotInfo = (address: Address, spender: Address) => {
  const BALANCE_SLOT_SEED: Hex = "0x87a211a2";
  const ALLOWANCE_SLOT_SEED: Hex = "0x7f5e9f20";

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

export default removeLiquidityPreview;
