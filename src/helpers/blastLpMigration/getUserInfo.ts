import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { Address } from "viem";
import {
  MAGIC_LP_ADDRESS,
  BLAST_BRIDGE_ADDRESS,
  LOCK_CONTRACT_ADDRESS,
} from "@/constants/blastLpMigration";

import BlastMagicLPBridgeAbi from "@/abis/BlastMagicLPBridge";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import BlastLockingMultiRewardsAbi from "@/abis/BlastLockingMultiRewards";
import { BlastLockingMultiRewards } from "@/constants/blast";

import merkleProof from "./merkleProof.json";

export type UserInfo = {
  nativeBalance: bigint;
  balances: {
    unlocked: bigint;
    locked: bigint;
  };
  balance: bigint;
  allowance: bigint;
  amountAllowed: {
    initialized: boolean;
    amount: bigint;
  };
  amountAllowedInitial: bigint;
  userLocks: {
    amount: bigint;
    unlockTime: bigint;
  };
};

export const getUserInfo = async (
  account: Address,
  chainId = 81457
): Promise<UserInfo> => {
  const publicClient = getPublicClient(Number(chainId));

  const [balances, balance, allowance, amountAllowed, userLocksArr]: any =
    await publicClient.multicall({
      contracts: [
        {
          address: LOCK_CONTRACT_ADDRESS,
          abi: BlastLockingMultiRewardsAbi,
          functionName: "balances",
          args: [account],
        },
        {
          address: MAGIC_LP_ADDRESS,
          abi: BlastMagicLpAbi,
          functionName: "balanceOf",
          args: [account],
        },
        {
          address: MAGIC_LP_ADDRESS,
          abi: BlastMagicLpAbi,
          functionName: "allowance",
          args: [account, BLAST_BRIDGE_ADDRESS],
        },
        {
          address: BLAST_BRIDGE_ADDRESS,
          abi: BlastMagicLPBridgeAbi,
          functionName: "amountAllowed",
          args: [account],
        },
        {
          address: BlastLockingMultiRewards,
          abi: BlastLockingMultiRewardsAbi,
          functionName: "userLocks",
          args: [account],
        },
      ],
    });

  const nativeBalance = await publicClient.getBalance({ address: account });

  const amountAllowedInitial = merkleProof.items.find(
    (item) => item.account.toLowerCase() === account.toLowerCase()
  )!.amount;

  const userLocks = userLocksArr.result.map(
    ({ amount, unlockTime }: { amount: bigint; unlockTime: bigint }) => {
      return {
        amount,
        unlockTime,
      };
    }
  );

  return {
    nativeBalance,
    balances: {
      unlocked: balances.result.unlocked,
      locked: balances.result.locked,
    },
    balance: balance.result,
    allowance: allowance.result,
    amountAllowed: {
      initialized: amountAllowed.result.initialized,
      amount: amountAllowed.result.amount,
    },
    amountAllowedInitial: BigInt(amountAllowedInitial),
    userLocks,
  };
};
