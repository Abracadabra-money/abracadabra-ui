import {
  ARBITRUM_CHAIN_ID,
  BLAST_CHAIN_ID,
  KAVA_CHAIN_ID,
  MAINNET_CHAIN_ID,
} from "@/constants/global";
import type {
  GraphPairConfig,
  GraphPairsConfigs,
} from "@/helpers/pools/configs/fetchPairsList";
import router from "@/router";
import type { Address } from "viem";
import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLpAbi";
import localPoolConfigs from "@/configs/pools/pools";
import type { PoolConfig } from "@/configs/pools/types";
import { tokenConfigs } from "@/configs/pools/tokenConfigs";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { blackListedPools } from "@/helpers/pools/configs/blackList";
import { whiteListedPools } from "@/helpers/pools/configs/whiteList";
import { fetchPairsList } from "@/helpers/pools/configs/fetchPairsList";

const poolChains = [
  MAINNET_CHAIN_ID,
  KAVA_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  BLAST_CHAIN_ID,
];

export const getPoolConfigsByChains = async (chainsArr: number[] = []) => {
  const iteratedChains = chainsArr.length ? chainsArr : poolChains;

  const result = await Promise.allSettled(
    iteratedChains.flatMap(async (chainId) => {
      const pairsList = (await fetchPairsList(chainId)) as GraphPairsConfigs;

      if (pairsList) {
        const filterPools = filterBlacklistPools(pairsList, chainId);

        return Promise.all(
          filterPools.map((pool: GraphPairConfig) =>
            findOrCreatePoolConfig(pool, chainId)
          )
        );
      }
    })
  );

  return result
    .map((response) => {
      if (response.status === "fulfilled") {
        return response.value;
      }
    })
    .filter((item): item is PoolConfig[] => item !== undefined)
    .flat();
};

export const getPoolConfig = async (
  chainId: number,
  poolId: string
): Promise<PoolConfig | null> => {
  const poolConfig = (await fetchPairsList(chainId, poolId)) as {
    pair: GraphPairConfig;
  };

  if (!poolConfig) {
    router.push({ name: "Pools" });
    return null;
  }

  return await findOrCreatePoolConfig(poolConfig.pair, chainId);
};

const filterBlacklistPools = (
  pairsList: GraphPairsConfigs,
  chainId: number
) => {
  const blackListArr =
    blackListedPools[chainId as keyof typeof blackListedPools];
  const whiteListArr =
    whiteListedPools[chainId as keyof typeof whiteListedPools];

  const blackListSet = new Set(
    blackListArr?.map((id) => id.toLocaleLowerCase()) || []
  );
  const whiteListSet = new Set(
    whiteListArr?.map((id) => id.toLocaleLowerCase()) || []
  );

  return pairsList.pairs.filter((pool: any) => {
    const poolId = pool.id.toLocaleLowerCase();
    return !blackListSet.has(poolId) && whiteListSet.has(poolId);
  });
};

const findOrCreatePoolConfig = async (
  pool: GraphPairConfig,
  chainId: number
): Promise<PoolConfig> => {
  const localConfig = localPoolConfigs.find(
    (localPool) =>
      localPool.id.toLocaleLowerCase() === pool.id.toLocaleLowerCase() &&
      !localPool.isAdditionalConfig
  );

  return (localConfig as PoolConfig)
    ? (localConfig as PoolConfig)
    : await createPoolConfig(pool, chainId);
};

const createPoolConfig = async (pool: GraphPairConfig, chainId: number) => {
  const publicClient = getPublicClient(chainId);

  const contractCalls = [
    { address: pool.id, abi: BlastMagicLpAbi, functionName: "name", args: [] },
    {
      address: pool.id,
      abi: BlastMagicLpAbi,
      functionName: "decimals",
      args: [],
    },
    {
      address: pool.baseToken.id,
      abi: erc20Abi,
      functionName: "symbol",
      args: [],
    },
    {
      address: pool.baseToken.id,
      abi: erc20Abi,
      functionName: "decimals",
      args: [],
    },
    {
      address: pool.quoteToken.id,
      abi: erc20Abi,
      functionName: "symbol",
      args: [],
    },
    {
      address: pool.quoteToken.id,
      abi: erc20Abi,
      functionName: "decimals",
      args: [],
    },
  ];

  const [
    { result: lpName },
    { result: lpDecimals },
    { result: baseTokenSymbol },
    { result: baseTokenDecimals },
    { result: quoteTokenSymbol },
    { result: quoteTokenDecimals },
  ] = await publicClient.multicall({ contracts: contractCalls });

  const baseTokenConfig = getTokenConfig(
    pool.baseToken.id,
    chainId,
    baseTokenSymbol
  );

  const quoteTokenConfig = getTokenConfig(
    pool.quoteToken.id,
    chainId,
    quoteTokenSymbol
  );

  const formattedLpName = lpName.split(" ").pop().replace("/", " / ");

  const poolConfig = {
    id: pool.id,
    chainId: chainId,
    name: formattedLpName,
    icon: useImage(`assets/images/tokens/MIM-deUSD.png`),
    decimals: lpDecimals,
    contract: {
      address: pool.id as Address,
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: baseTokenConfig.name,
      icon: baseTokenConfig.icon,
      decimals: baseTokenDecimals,
      contract: {
        address: pool.baseToken.id,
        abi: erc20Abi,
      },
    },
    quoteToken: {
      name: quoteTokenConfig.name,
      icon: quoteTokenConfig.icon,
      contract: {
        address: pool.quoteToken.id,
        abi: erc20Abi,
      },
      decimals: quoteTokenDecimals,
    },
    settings: {
      isNew: false,
      isDeprecated: false,
      isMim: false,
    },
    initialParameters: {
      I: pool.i,
      K: pool.k,
      lpFeeRate: pool.lpFeeRate,
    },
  };

  return checkAndAddAdditionalConfigs(poolConfig);
};

const getTokenConfig = (address: string, chainId: number, tokenSymbol = "") => {
  const tokenConfig = tokenConfigs[chainId as keyof typeof tokenConfigs].find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );

  if (tokenConfig) return tokenConfig;

  const src = useImage(`assets/images/tokens/${tokenSymbol}.png`);
  const baseTokenIcon = useImage("assets/images/base_token_icon.png");
  const tokenIcon = src.includes("undefined") ? baseTokenIcon : src;

  return {
    chainId: chainId,
    name: tokenSymbol,
    address: address,
    icon: tokenIcon,
  };
};

const checkAndAddAdditionalConfigs = (poolConfig: PoolConfig): PoolConfig => {
  const localConfig = localPoolConfigs.find(
    (config) =>
      config.id.toLowerCase() === poolConfig.id.toLowerCase() &&
      config.chainId === poolConfig.chainId
  );

  if (localConfig && localConfig.isAdditionalConfig) {
    const stakeContract = localConfig.stakeContract;
    if (stakeContract) poolConfig.stakeContract = stakeContract;
    const rewardTokens = localConfig.rewardTokens;
    if (rewardTokens) poolConfig.rewardTokens = rewardTokens;
    const settings = localConfig.settings;
    if (settings) poolConfig.settings = settings;

    return poolConfig;
  }

  return poolConfig;
};
