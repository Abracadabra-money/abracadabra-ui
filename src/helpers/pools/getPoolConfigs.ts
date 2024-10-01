import {
  ARBITRUM_CHAIN_ID,
  BLAST_CHAIN_ID,
  MAINNET_CHAIN_ID,
} from "@/constants/global";
import axios from "axios";
import router from "@/router";
import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLpAbi";
import localPoolConfigs from "@/configs/pools/pools";
import type { PoolConfig } from "@/configs/pools/types";
import { graphAPIs } from "@/constants/pools/poolCreation";
import { tokenConfigs } from "@/configs/pools/tokenConfigs";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

const poolChains = [MAINNET_CHAIN_ID, ARBITRUM_CHAIN_ID, BLAST_CHAIN_ID];
// const blackListedPools = [
// "0x5895bff185127a01a333cbea8e53dcf172c13f35",
// "0x61679bdd546d5c80350dd9f9f56312f2585be9a9",
// "0xa311a0bfb5789ebdc2171fd707494e8ad7fac59c",
// "0xd9f58d32d3f89b56112269718317db94c27d34c4",
// "0xca3e789bcabaccb5606f06e246bcc53927befe00",
// ];

const getGraphQuery = (poolId: string) => {
  const query = poolId ? `pair(id: "${poolId}")` : `pairs(first: 1000)`;

  return `
      query MyQuery {
              ${query} {
                        id
                        i
                        k
                        lpFeeRate
                        quoteToken {
                          id
                        }
                        baseToken {
                          id
                        }
                }
        }`;
};

const fetchPools = async (chainId: number, poolId = "") => {
  const subgraphUrl = graphAPIs[chainId as keyof typeof graphAPIs];
  const query = getGraphQuery(poolId);
  const { data } = await axios.post(subgraphUrl, { query });
  return data.data;
};

const processPool = async (pool: any, chainId: number) => {
  const localConfig = localPoolConfigs.find(
    (localPool) =>
      localPool.contract.address.toLocaleLowerCase() ===
      pool.id.toLocaleLowerCase()
  );

  return localConfig ? localConfig : await createPoolConfig(pool, chainId);
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

const createPoolConfig = async (pool: any, chainId: number) => {
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

  const formattedLpName = lpName.split(' ').pop().replace('/', ' / ')

  return {
    id: pool.id,
    chainId: chainId,
    name: formattedLpName,
    icon: useImage(`assets/images/tokens/MIM-deUSD.png`),
    decimals: lpDecimals,
    contract: {
      address: pool.id,
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
};

export const getPoolConfigs = async () => {
  const result = await Promise.allSettled(
    poolChains.flatMap(async (chainId) => {
      const pools = await fetchPools(chainId);

      if (pools) {
        // const filterPools = pools.pairs.filter(
        //   (pool: any) =>
        //     blackListedPools.includes(pool.id.toLocaleLowerCase()) === false
        // );

        return Promise.all(
          pools.pairs.map((pool: any) => processPool(pool, chainId))
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
    .filter((item) => item)
    .flat();
};

export const getPoolConfig = async (
  chainId: number,
  poolId: string
): Promise<PoolConfig | null> => {
  const poolConfig = await fetchPools(chainId, poolId);

  if (!poolConfig) {
    router.push({ name: "Pools" });
    return null;
  }

  return await processPool(poolConfig.pair, chainId);
};
