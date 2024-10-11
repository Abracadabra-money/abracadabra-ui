import axios from "axios";
import localPoolConfigs from "@/configs/pools/pools";
import type { PoolConfig } from "@/configs/pools/types";
import { graphAPIs } from "@/constants/pools/poolCreation";

export type GraphPairConfig = {
  id: string;
  i: bigint;
  k: bigint;
  lpFeeRate: bigint;
  baseToken: {
    id: `0x${string}`;
  };
  quoteToken: {
    id: `0x${string}`;
  };
};

export type GraphPairsConfigs = {
  pairs: GraphPairConfig[];
};

export const fetchPairsList = async (
  chainId: number,
  poolId = ""
): Promise<GraphPairsConfigs | { pair: GraphPairConfig } | null> => {
  const subgraphUrl = graphAPIs[chainId as keyof typeof graphAPIs];
  if (!subgraphUrl && !poolId) return checkLocalPairsByChain(chainId);
  else if (!subgraphUrl && poolId) return checkLocalPairById(chainId, poolId);

  const query = createPairsRequest(poolId);
  const { data } = await axios.post(subgraphUrl, { query });

  return data.data;
};

const checkLocalPairsByChain = (chainId: number) => {
  const filteredLocalConfigs = localPoolConfigs.filter(
    (config) => config.chainId === chainId && !config.isAdditionalConfig
  ) as PoolConfig[];

  const pairs = filteredLocalConfigs.map((config) => {
    return {
      id: config.id,
      i: config.initialParameters.I,
      k: config.initialParameters.K,
      lpFeeRate: config.initialParameters.lpFeeRate,
      baseToken: { id: config.baseToken.contract.address },
      quoteToken: { id: config.quoteToken.contract.address },
    };
  });

  return { pairs };
};

const checkLocalPairById = (chainId: number, poolId = "") => {
  const pair = localPoolConfigs.find(
    (config) =>
      config.id === poolId &&
      config.chainId === chainId &&
      !config.isAdditionalConfig
  ) as PoolConfig | undefined;

  if (!pair) return null;

  return {
    pair: {
      id: pair.id,
      i: pair.initialParameters.I,
      k: pair.initialParameters.K,
      lpFeeRate: pair.initialParameters.lpFeeRate,
      baseToken: { id: pair.baseToken.contract.address },
      quoteToken: { id: pair.quoteToken.contract.address },
    },
  };
};

const createPairsRequest = (poolId: string) => {
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
