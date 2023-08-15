import { Pool } from "@uniswap/v3-sdk";
import { BigNumber, utils } from "ethers";
import { Token } from "@uniswap/sdk-core";
import {
  GLP_DECIMALS,
  tokens,
} from "@/helpers/collateralsApy/getMegicGlpApy/constants";
import type { Prices } from "@/helpers/collateralsApy/getMegicGlpApy/types";

const precision = BigNumber.from(Math.pow(10, GLP_DECIMALS).toString());

export const getPrices = async (
  contracts: any,
  chainId: number
): Promise<Prices | void> => {
  if (chainId === 42161) return await getArbitrumPrices(contracts, chainId);
  if (chainId === 43114) return await getAvaxPrices(contracts, chainId);
};

const getArbitrumPrices = async (
  contracts: any,
  chainId: number
): Promise<Prices> => {
  const nativeToken: any = tokens[chainId as keyof typeof tokens].nativeToken;
  const gmxAddress: any = tokens[chainId as keyof typeof tokens].gmx;

  const [uniPoolSlot0, nativeTokenPrice] = await Promise.all([
    contracts.gmxPoolContract.slot0(),
    contracts.vaultContract.getMinPrice(nativeToken),
  ]);

  const tokenWeth = new Token(chainId, nativeToken, 18, "SYMBOL", "NAME");
  const tokenGmx = new Token(chainId, gmxAddress, 18, "SYMBOL", "NAME");

  const pool = new Pool(
    tokenWeth,
    tokenGmx,
    10000, // fee
    uniPoolSlot0.sqrtPriceX96, // sqrtRatioX96
    1, // liquidity
    uniPoolSlot0.tick, // tickCurrent
    []
  );

  const poolGmxPrice = pool.priceOf(tokenGmx).toSignificant(6);
  const parsePoolGmxPrice = utils.parseUnits(poolGmxPrice);
  const gmxPrice = parsePoolGmxPrice?.mul(nativeTokenPrice).div(precision);

  return { gmxPrice, nativeTokenPrice };
};

export const getAvaxPrices = async (
  contracts: any,
  chainId: number
): Promise<Prices> => {
  const nativeToken: any = tokens[chainId as keyof typeof tokens].nativeToken;

  const [reserves, avaxPrice, nativeTokenPrice] = await Promise.all([
    contracts.gmxPoolContract.getReserves(),
    contracts.aggregatorContract.latestAnswer(),
    contracts.vaultContract.getMinPrice(nativeToken),
  ]);

  const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
  const reserve0Parse = +utils.formatUnits(reserve0.toString());
  const reserve1Parse = +utils.formatUnits(reserve1.toString());
  const avaxAmount = reserve1Parse / reserve0Parse;

  const avaxPriceParse = +utils.formatUnits(avaxPrice.toString(), 8);
  const gmxPrice = utils.parseUnits((avaxAmount * avaxPriceParse).toString());

  return { gmxPrice, nativeTokenPrice };
};
