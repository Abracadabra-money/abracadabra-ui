import type { Address } from "viem";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { oSpellLockConfig } from "@/configs/stake/oSpellConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { MAINNET_SPELL_ADDRESS } from "@/constants/tokensAddress";
import type { SpellLockConfig } from "@/configs/stake/oSpellConfig";

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
  oSpell: {
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
    userLocks: bigint;
    lockDuration: bigint;
  };
};

export const getLockInfo = async (
  account: Address,
  chainId: number
): Promise<SpellLockInfo> => {
  const config = oSpellLockConfig[chainId as keyof typeof oSpellLockConfig];

  const spellPrice = await getCoinsPrices(MAINNET_CHAIN_ID, [
    MAINNET_SPELL_ADDRESS,
  ]);

  if (!account) return getEmptyState(config, spellPrice);

  const publicClient = getPublicClient(chainId);

  const [
    oSpellBalance,
    oSpellApprovedAmount,
    balances,
    userLocks,
    lockDuration,
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
    oSpell: {
      ...config.oSpell,
      balance: oSpellBalance.result as bigint,
      approvedAmount: oSpellApprovedAmount.result as bigint,
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
    oSpell: {
      ...config.oSpell,
      balance: 0n,
      approvedAmount: 0n,
    },
    tokenBank: {
      ...config.tokenBank,
    },
    lockInfo: {
      lockAmount: 0n,
      claimAmount: 0n,
      userLocks: 0n,
      lockDuration: 0n,
    },
  };
};
