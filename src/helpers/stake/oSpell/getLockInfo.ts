import type { Address } from "viem";
import { useImage } from "@/helpers/useImage";
import { oSpellLockConfig } from "@/configs/stake/oSpellConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getLockInfo = async (account: Address, chainId: number) => {
  const config = oSpellLockConfig[chainId as keyof typeof oSpellLockConfig];

  if (!config || !account) return lockEmptyState;

  const publicClient = getPublicClient(chainId);

  const [
    oSpellBalance,
    oSpellApprovedAmount,
    balances,
    userLocks,
    nextUnlockTime,
    epoch,
    nextEpoch,
    remainingEpochTime,
  ] = await publicClient.multicall({
    contracts: [
      {
        ...config.oSpell.contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...config.oSpell.contract,
        functionName: "allowance",
        args: [account, config.tokenBank],
      },
      {
        ...config.tokenBank,
        functionName: "balances",
        args: [account],
      },
      {
        ...config.tokenBank,
        functionName: "userLocks",
        args: [],
      },
      {
        ...config.tokenBank,
        functionName: "nextUnlockTime",
        args: [],
      },
      {
        ...config.tokenBank,
        functionName: "epoch",
        args: [],
      },
      {
        ...config.tokenBank,
        functionName: "nextEpoch",
        args: [],
      },
      {
        ...config.tokenBank,
        functionName: "remainingEpochTime",
        args: [],
      },
    ],
  });

  return {
    spell: {
      ...config.spell,
    },
    oSpell: {
      ...config.oSpell,
      balance: oSpellBalance.result as bigint,
      approvedAmount: oSpellApprovedAmount.result as bigint,
    },
    tokenBank: {
      ...config.tokenBank,
    },
    lockInfo: {
      balances: balances.result as bigint,
      userLocks: userLocks.result as bigint,
      nextUnlockTime: nextUnlockTime.result as bigint,
      epoch: epoch.result as bigint,
      nextEpoch: nextEpoch.result as bigint,
      remainingEpochTime: remainingEpochTime.result as bigint,
    },
  };
};

const lockEmptyState = {
  spell: {
    name: "SPELL",
    decimals: 18,
    icon: useImage("assets/images/tokens/SPELL.png"),
  },
  oSpell: {
    name: "OSPELL",
    decimals: 18,
    icon: useImage("assets/images/tokens/SPELL.png"),
  },
  tokenBank: {
    address: "",
    abi: [],
  },
  lockInfo: {
    balances: 0n,
    userLocks: 0n,
    nextUnlockTime: 0n,
    epoch: 0n,
    nextEpoch: 0n,
    remainingEpochTime: 0n,
  },
};
