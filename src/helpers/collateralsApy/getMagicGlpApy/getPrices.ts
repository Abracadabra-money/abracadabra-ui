import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import {
  GLP_DECIMALS,
  tokens,
} from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import type { Prices } from "@/helpers/collateralsApy/getMagicGlpApy/types";
import { formatUnits, parseUnits, type PublicClient } from "viem";
import type { ContractInfo } from "@/types/global";

const precision = parseUnits("1", GLP_DECIMALS);

export const getPrices = async (
  contracts: Record<string, ContractInfo>,
  chainId: number,
  publicClient: PublicClient

): Promise<Prices | void> => {
  if (chainId === 42161) return await getArbitrumPrices(contracts, chainId, publicClient);
  if (chainId === 43114) return await getAvaxPrices(contracts, chainId, publicClient);
};

const getArbitrumPrices = async (
  contracts: Record<string, ContractInfo>,
  chainId: number,
  publicClient: PublicClient
): Promise<Prices> => {
  const nativeToken: any = tokens[chainId as keyof typeof tokens].nativeToken;
  const gmxAddress: any = tokens[chainId as keyof typeof tokens].gmx;

  const [uniPoolSlot0Response, nativeTokenPriceResponse] = await publicClient.multicall({
    contracts: [
      {
        ...contracts.gmxPool,
        functionName: 'slot0',
        args: []
      },
      {
        ...contracts.vault,
        functionName: 'getMinPrice',
        args: [nativeToken]
      }
    ],
  });

  const tokenWeth = new Token(chainId, nativeToken, 18, "SYMBOL", "NAME");
  const tokenGmx = new Token(chainId, gmxAddress, 18, "SYMBOL", "NAME");

  const sqrtPriceX96: any = Number((uniPoolSlot0Response.result as any)[0]);
  const tick = (uniPoolSlot0Response.result as any)[1];

  const pool = new Pool(
    tokenWeth,
    tokenGmx,
    10000, // fee
    sqrtPriceX96, // sqrtRatioX96
    1, // liquidity
    tick, // tickCurrent
    []
  );

  const nativeTokenPrice: bigint = nativeTokenPriceResponse.result as bigint;

  const poolGmxPrice = pool.priceOf(tokenGmx).toSignificant(6);
  const parsePoolGmxPrice = parseUnits(poolGmxPrice, GLP_DECIMALS);
  const gmxPrice = (parsePoolGmxPrice * nativeTokenPrice) / precision;

  return { gmxPrice, nativeTokenPrice };
};

export const getAvaxPrices = async (
  contracts: Record<string, ContractInfo>,
  chainId: number,
  publicClient: PublicClient
): Promise<Prices> => {
  const nativeToken: any = tokens[chainId as keyof typeof tokens].nativeToken;

  const [{ result: reserves }, { result: avaxPrice }, { result: nativeTokenPrice }]: any =
    await publicClient.multicall({
      contracts: [
        {
          ...contracts.gmxPool,
          functionName: 'getReserves',
          args: []
        },
        {
          ...contracts.aggregator,
          functionName: 'latestAnswer',
          args: []
        },
        {
          ...contracts.vault,
          functionName: 'getMinPrice',
          args: [nativeToken]
        }
      ],
    });

  const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;

  const avaxAmount = (reserve1 * precision) / reserve0;
  const formattedAvaxAmount = Number(formatUnits(avaxAmount, GLP_DECIMALS))
  const avaxPriceParse = Number(formatUnits(avaxPrice, 8));
  const gmxPrice = parseUnits((formattedAvaxAmount * avaxPriceParse).toString(), GLP_DECIMALS);

  return { gmxPrice, nativeTokenPrice };
};
