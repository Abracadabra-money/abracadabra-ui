import type { Address, PublicClient } from "viem";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import type { BSpellInfo } from "@/helpers/bSpell/types";
import { bSpellLockConfig } from "@/helpers/bSpell/сonfig";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { MAINNET_SPELL_ADDRESS } from "@/constants/tokensAddress";
import type { bSpellConfig, TokenPrice } from "@/helpers/bSpell/types";

const getEmptyState = async (
  config: bSpellConfig,
  spellPrice: TokenPrice[],
  chainId: number
): Promise<BSpellInfo> => {
  const publicClient = getPublicClient(chainId);

  const [
    lockDuration,
    instantRedeemParams,
    bSpellTotalSupply,
    stakeTotalSupply,
  ] = await publicClient.multicall({
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
      {
        ...config.bSpell.contract,
        functionName: "totalSupply",
        args: [],
      },
      {
        ...config.stakeInfo,
        functionName: "totalSupply",
        args: [],
      },
    ],
  });

  const rewardTokensInfo = await getUserRewards(config, publicClient, null);

  return {
    chainId: Number(chainId),
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
      totalSupply: bSpellTotalSupply.result as bigint,
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
    stakeInfo: {
      unlockTime: 0,
      contract: { ...config.stakeInfo! },
      totalSupply: stakeTotalSupply.result as bigint,
      stakeBalance: 0n,
      approvedAmount: 0n,
      lastAdded: 0n,
      lockupPeriod: 0n,
    },
    rewardTokensInfo,
  };
};

const getStakeInfo = async (
  config: bSpellConfig,
  publicClient: PublicClient,
  account: Address
) => {
  if (!config.stakeInfo) return null;

  const [approvedAmount, stakeBalance, totalSupply, lastAdded, lockupPeriod] =
    await publicClient.multicall({
      contracts: [
        {
          ...config.bSpell.contract,
          functionName: "allowance",
          args: [account, config.stakeInfo.address],
        },
        {
          ...config.stakeInfo,
          functionName: "balanceOf",
          args: [account],
        },
        {
          ...config.stakeInfo,
          functionName: "totalSupply",
          args: [],
        },
        {
          ...config.stakeInfo,
          functionName: "lastAdded",
          args: [account],
        },
        {
          ...config.stakeInfo,
          functionName: "lockupPeriod",
          args: [],
        },
      ],
    });

  const unlockTime = Number(
    (lastAdded.result as bigint) + (lockupPeriod.result as bigint)
  );

  return {
    unlockTime,
    contract: { ...config.stakeInfo },
    lastAdded: lastAdded.result as bigint,
    totalSupply: totalSupply.result as bigint,
    stakeBalance: stakeBalance.result as bigint,
    lockupPeriod: lockupPeriod.result as bigint,
    approvedAmount: approvedAmount.result as bigint,
  };
};

const getUserRewards = async (
  config: bSpellConfig,
  publicClient: PublicClient,
  account: Address | null
) => {
  if (!config?.rewardTokensInfo || !config.stakeInfo) return null;

  const tokenAddresses = config.rewardTokensInfo.reduce(
    (acc: Address[], token) => {
      if (token.contract?.addressForPrice) {
        acc.push(token.contract.addressForPrice);
        return acc;
      }

      acc.push(token.contract.address);
      return acc;
    },
    []
  );

  const rewardTokensPrices = await getCoinsPrices(
    publicClient!.chain!.id,
    tokenAddresses
  );

  if (!account) {
    return config.rewardTokensInfo.map((tokenInfo, idx) => {
      return {
        ...tokenInfo,
        price: rewardTokensPrices[idx].price || 0,
        rewardAmount: 0n,
      };
    });
  }

  const contracts = config.rewardTokensInfo.map((tokenInfo) => {
    return {
      address: config!.stakeInfo!.address,
      abi: config!.stakeInfo!.abi,
      functionName: "rewards",
      args: [account, tokenInfo.contract.address],
    };
  });

  const response = await publicClient.multicall({
    contracts,
  });

  const result = response.map((item) => {
    if (item.status === "success") {
      return item;
    }
    return { result: 0n, status: "success" };
  });

  return config.rewardTokensInfo.map((tokenInfo, idx) => {
    return {
      ...tokenInfo,
      price: rewardTokensPrices[idx].price || 0,
      rewardAmount: result[idx].result as bigint,
    };
  });
};

export const getBSpellInfo = async (
  account: Address
): Promise<BSpellInfo[]> => {
  const spellPrice = await getCoinsPrices(MAINNET_CHAIN_ID, [
    MAINNET_SPELL_ADDRESS,
  ]);

  if (!account) {
    const result = await Promise.allSettled(
      Object.keys(bSpellLockConfig).map(async (chainId: string) => {
        const config =
          bSpellLockConfig[Number(chainId) as keyof typeof bSpellLockConfig];

        return await getEmptyState(config, spellPrice, Number(chainId));
      })
    );

    return result
      .map((response) => {
        if (response.status === "fulfilled") {
          return response.value;
        }
      })
      .filter((item): item is BSpellInfo => item !== undefined)
      .flat();
  }

  return await Promise.all(
    Object.keys(bSpellLockConfig).map(async (chainId: string) => {
      const config =
        bSpellLockConfig[Number(chainId) as keyof typeof bSpellLockConfig];

      const publicClient = getPublicClient(Number(chainId));

      const [
        bSpellBalance,
        bSpellApprovedAmount,
        bSpellTotalSupply,
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
            ...config.bSpell.contract,
            functionName: "totalSupply",
            args: [],
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

      const stakeInfo = await getStakeInfo(config, publicClient, account);

      const rewardTokensInfo = await getUserRewards(
        config,
        publicClient,
        account
      );

      return {
        chainId: Number(chainId),
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
          totalSupply: bSpellTotalSupply.result as bigint,
          approvedAmount: bSpellApprovedAmount.result as bigint,
        },
        tokenBank: {
          ...config.tokenBank,
        },
        stakeInfo,
        lockInfo: {
          lockAmount: balances.result[0] as bigint,
          claimAmount: balances.result[1] as bigint,
          userLocks: userLocks.result as {
            amount: bigint;
            unlockTime: bigint;
          }[],
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
        rewardTokensInfo,
      };
    })
  );
};
