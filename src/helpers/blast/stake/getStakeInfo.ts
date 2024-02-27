import type { Address } from "viem";

import type {
  DepositTokenConfig,
  BlastStakeConfig,
  DepositedBalances,
  BlastUserTokenInfo,
  BlastStakeTokenInfo,
  BlastStakeInfo,
} from "@/configs/blast/types";

import { blastStakeConfig } from "@/configs/blast/stake";
import { getPublicClient } from "@/helpers/getPublicClient";

const tokenInfoEmptyState = {
  allowance: 0n,
  balance: 0n,
  balances: {
    unlocked: 0n,
    locked: 0n,
    total: 0n,
  },
};

export const getStakeInfo = async (
  account: Address,
  chainId: number = 168587773
): Promise<BlastStakeInfo> => {
  const config = blastStakeConfig;
  const publicClient = getPublicClient(chainId);

  const [state]: any = await publicClient.multicall({
    contracts: [
      {
        address: config.contract.address,
        abi: config.contract.abi,
        functionName: "state",
        args: [],
      },
    ],
  });

  const tokensInfo = await Promise.all(
    config.tokens.map((tokenConfig: any) =>
      getStakeTokenInfo(config, tokenConfig, publicClient, account)
    )
  );

  return {
    config,
    state: state.result,
    tokensInfo,
  };
};

const getStakeTokenInfo = async (
  stakeConfig: BlastStakeConfig,
  tokenConfig: DepositTokenConfig,
  publicClient: any,
  account?: Address
): Promise<BlastStakeTokenInfo> => {
  const [caps, isSupported, totals]: any = await publicClient.multicall({
    contracts: [
      {
        address: stakeConfig.contract.address,
        abi: stakeConfig.contract.abi,
        functionName: "caps",
        args: [tokenConfig.contract.address],
      },
      {
        address: stakeConfig.contract.address,
        abi: stakeConfig.contract.abi,
        functionName: "supportedTokens",
        args: [tokenConfig.contract.address],
      },
      {
        address: stakeConfig.contract.address,
        abi: stakeConfig.contract.abi,
        functionName: "totals",
        args: [tokenConfig.contract.address],
      },
    ],
  });

  const userInfo = account
    ? await getUserTokenInfo(account, stakeConfig, tokenConfig, publicClient)
    : tokenInfoEmptyState;

  return {
    caps: caps.result,
    isSupported: isSupported.result,
    totals: parseBalances(totals.result),
    userInfo,
  };
};

const getUserTokenInfo = async (
  account: Address,
  stakeConfig: BlastStakeConfig,
  tokenConfig: DepositTokenConfig,
  publicClient: any
): Promise<BlastUserTokenInfo> => {
  const [allowance, balance, balances]: any = await publicClient.multicall({
    contracts: [
      {
        address: tokenConfig.contract.address,
        abi: tokenConfig.contract.abi,
        functionName: "allowance",
        args: [stakeConfig.contract.address, account],
      },
      {
        address: tokenConfig.contract.address,
        abi: tokenConfig.contract.abi,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: stakeConfig.contract.address,
        abi: stakeConfig.contract.abi,
        functionName: "balances",
        args: [account, tokenConfig.contract.address],
      },
    ],
  });

  return {
    allowance: allowance.result,
    balance: balance.result,
    balances: parseBalances(balances.result),
  };
};

const parseBalances = (
  balances: [bigint, bigint, bigint]
): DepositedBalances => {
  return {
    unlocked: balances[0],
    locked: balances[1],
    total: balances[2],
  };
};
