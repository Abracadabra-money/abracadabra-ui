import type { Address } from "viem";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import type { LockerInfo } from "@/helpers/bSpell/types";
import { bSpellLockConfig } from "@/helpers/bSpell/сonfig";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { MAINNET_SPELL_ADDRESS } from "@/constants/tokensAddress";
import type { LockerConfig, TokenPrice } from "@/helpers/bSpell/types";

export const getLockInfo = async (
  account: Address,
  chainId: number
): Promise<LockerInfo> => {
  const config = bSpellLockConfig[chainId as keyof typeof bSpellLockConfig];

  const spellPrice = await getCoinsPrices(MAINNET_CHAIN_ID, [
    MAINNET_SPELL_ADDRESS,
  ]);

  if (!account) return await getEmptyState(config, spellPrice, chainId);

  const publicClient = getPublicClient(chainId);

  const [
    bSpellBalance,
    bSpellApprovedAmount,
    balances,
    userLocks,
    lockDuration,
    instantRedeemParams,
    spellBalance,
    spellApprovedAmount,
  ] = await publicClient.multicall({
    contracts: [
      {
        ...config.bSpell.contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...config.bSpell.contract,
        functionName: "allowance",
        args: [account, config.tokenBank.address],
      },

      {
        ...config.tokenBank,
        functionName: "balances",
        args: [account],
      },
      {
        ...config.tokenBank,
        functionName: "userLocks",
        args: [account],
      },
      {
        ...config.tokenBank,
        functionName: "lockDuration",
        args: [],
      },
      {
        ...config.tokenBank,
        functionName: "instantRedeemParams",
        args: [],
      },
      {
        ...config.spell.contract,
        functionName: "balanceOf",
        args: [account],
      },
      {
        ...config.spell.contract,
        functionName: "allowance",
        args: [account, config.tokenBank.address],
      },
    ],
  });

  return {
    spell: {
      ...config.spell,
      price: spellPrice[0].price || 0,
      balance: spellBalance.result as bigint,
      approvedAmount: spellApprovedAmount.result as bigint,
    },
    bSpell: {
      ...config.bSpell,
      price: spellPrice[0].price || 0,
      balance: bSpellBalance.result as bigint,
      approvedAmount: bSpellApprovedAmount.result as bigint,
    },
    tokenBank: {
      ...config.tokenBank,
    },
    lockInfo: {
      lockAmount: balances.result[0] as bigint,
      claimAmount: balances.result[1] as bigint,
      userLocks: userLocks.result as { amount: bigint; unlockTime: bigint }[],
      lockDuration: lockDuration.result as bigint,
      instantRedeemParams: {
        immediateBips: instantRedeemParams.result[0],
        burnBips: instantRedeemParams.result[1],
        feeCollector: instantRedeemParams.result[2],
      } as {
        immediateBips: bigint;
        burnBips: bigint;
        feeCollector: Address;
      },
    },
  };
};

const getEmptyState = async (
  config: LockerConfig,
  spellPrice: TokenPrice[],
  chainId: number
): Promise<LockerInfo> => {
  const publicClient = getPublicClient(chainId);

  const [lockDuration, instantRedeemParams] = await publicClient.multicall({
    contracts: [
      {
        ...config.tokenBank,
        functionName: "lockDuration",
        args: [],
      },
      {
        ...config.tokenBank,
        functionName: "instantRedeemParams",
        args: [],
      },
    ],
  });

  return {
    spell: {
      ...config.spell,
      price: spellPrice[0].price || 0,
      balance: 0n,
      approvedAmount: 0n,
    },
    bSpell: {
      ...config.bSpell,
      price: spellPrice[0].price || 0,
      balance: 0n,
      approvedAmount: 0n,
    },
    tokenBank: {
      ...config.tokenBank,
    },
    lockInfo: {
      lockAmount: 0n,
      claimAmount: 0n,
      userLocks: [],
      lockDuration: lockDuration.result as bigint,
      instantRedeemParams: instantRedeemParams.result as {
        immediateBips: bigint;
        burnBips: bigint;
        feeCollector: Address;
      },
    },
  };
};
