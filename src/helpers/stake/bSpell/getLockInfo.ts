import type { Address } from "viem";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { bSpellLockConfig } from "@/configs/stake/bSpellConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { MAINNET_SPELL_ADDRESS } from "@/constants/tokensAddress";
import type { SpellLockConfig } from "@/configs/stake/bSpellConfig";

type Price = {
  address: Address;
  price: number;
};

export type SpellLockInfo = {
  spell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: string;
      abi: any;
    };
    price: number;
  };
  bSpell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: string;
      abi: any;
    };
    balance: bigint;
    approvedAmount: bigint;
  };
  tokenBank: {
    address: string;
    abi: any;
  };
  lockInfo: {
    lockAmount: bigint;
    claimAmount: bigint;
    userLocks: any;
    lockDuration: bigint;
  };
};

export const getLockInfo = async (
  account: Address,
  chainId: number
): Promise<SpellLockInfo> => {
  const config = bSpellLockConfig[chainId as keyof typeof bSpellLockConfig];

  const spellPrice = await getCoinsPrices(MAINNET_CHAIN_ID, [
    MAINNET_SPELL_ADDRESS,
  ]);

  if (!account) return getEmptyState(config, spellPrice);

  const publicClient = getPublicClient(chainId);

  const [
    bSpellBalance,
    bSpellApprovedAmount,
    balances,
    userLocks,
    lockDuration,
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
    ],
  });

  return {
    spell: {
      ...config.spell,
      price: spellPrice[0].price || 0,
    },
    bSpell: {
      ...config.bSpell,
      balance: bSpellBalance.result as bigint,
      approvedAmount: bSpellApprovedAmount.result as bigint,
    },
    tokenBank: {
      ...config.tokenBank,
    },
    lockInfo: {
      lockAmount: balances.result[0] as bigint,
      claimAmount: balances.result[1] as bigint,
      userLocks: userLocks.result as bigint,
      lockDuration: lockDuration.result as bigint,
    },
  };
};

const getEmptyState = (config: SpellLockConfig, spellPrice: Price[]) => {
  return {
    spell: {
      ...config.spell,
      price: spellPrice[0].price || 0,
    },
    bSpell: {
      ...config.bSpell,
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
      lockDuration: 0n,
    },
  };
};
