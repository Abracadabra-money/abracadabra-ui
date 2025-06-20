import { getRouterFactoryByChain } from "@/configs/pools/routers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { parseAbi, type Address } from "viem";
import magicLpAbi from "@/abis/BlastMagicLP";
import type { GraphPairConfig } from "@/helpers/pools/configs/fetchPairsList";

const fabricAbi = parseAbi([
  "function pools(address base, address quote, uint256 index) view returns (address)",
  "function getPoolCount(address token0, address token1) view returns (uint256)",
]);

type PoolResult = {
  result: Address;
  status: "success";
};

export const fetchPoolsAddressesFromFabric = async (
  chainId: number,
  baseToken: Address,
  quoteToken: Address
): Promise<Address[]> => {
  const publicClient = getPublicClient(chainId);
  const factory = getRouterFactoryByChain(chainId);

  const [baseQuoteCount, quoteBaseCount] = await publicClient.multicall({
    contracts: [
      {
        address: factory,
        abi: fabricAbi,
        functionName: "getPoolCount",
        args: [baseToken, quoteToken],
      },
      {
        address: factory,
        abi: fabricAbi,
        functionName: "getPoolCount",
        args: [quoteToken, baseToken],
      },
    ],
  });

  const contracts = [];

  for (let i = 0; i < Number(baseQuoteCount.result); i++) {
    contracts.push({
      address: factory,
      abi: fabricAbi,
      functionName: "pools",
      args: [baseToken, quoteToken, BigInt(i)],
    });
  }

  for (let i = 0; i < Number(quoteBaseCount.result); i++) {
    contracts.push({
      address: factory,
      abi: fabricAbi,
      functionName: "pools",
      args: [quoteToken, baseToken, BigInt(i)],
    });
  }

  const pools = (await publicClient.multicall({
    contracts,
  })) as PoolResult[];

  const uniquePools = [...new Set(pools.map((pool) => pool.result))];

  return uniquePools;
};

export const fetchPendingPoolsData = async (
  chainId: number,
  poolAddresses: Address[]
): Promise<GraphPairConfig[]> => {
  const publicClient = getPublicClient(chainId);

  const contracts = poolAddresses.flatMap((poolAddress) => [
    {
      address: poolAddress,
      abi: magicLpAbi,
      functionName: "_I_",
      args: [],
    },
    {
      address: poolAddress,
      abi: magicLpAbi,
      functionName: "_K_",
      args: [],
    },
    {
      address: poolAddress,
      abi: magicLpAbi,
      functionName: "_LP_FEE_RATE_",
      args: [],
    },
    {
      address: poolAddress,
      abi: magicLpAbi,
      functionName: "_BASE_TOKEN_",
      args: [],
    },
    {
      address: poolAddress,
      abi: magicLpAbi,
      functionName: "_QUOTE_TOKEN_",
      args: [],
    },
  ]);

  const results = await publicClient.multicall({
    contracts,
  });

  const poolsData: GraphPairConfig[] = [];

  // Process results in chunks of 5 (5 calls per pool)
  for (let i = 0; i < results.length; i += 5) {
    const [
      { result: iValue },
      { result: kValue },
      { result: lpFeeRateValue },
      { result: baseTokenValue },
      { result: quoteTokenValue },
    ] = results.slice(i, i + 5);

    poolsData.push({
      id: poolAddresses[i / 5],
      i: iValue as bigint,
      k: kValue as bigint,
      lpFeeRate: lpFeeRateValue as bigint,
      baseToken: {
        id: baseTokenValue as `0x${string}`,
      },
      quoteToken: {
        id: quoteTokenValue as `0x${string}`,
      },
    });
  }

  return poolsData;
};
