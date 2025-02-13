import {
  BERA_MIM_ADDRESS,
  BERA_HONEY_ADDRESS,
} from "./kodiakIslandRouter/constants";
import { BERA_CHAIN_ID } from "@/constants/global";
import {
  type Address,
  type PublicClient,
  formatUnits,
  parseUnits,
  parseAbi,
} from "viem";

import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import type { TokenPrice } from "@/helpers/prices/defiLlama";

const PERCENT_TARGET = 1000000n
const PERCENT_PRESITION = 4;

// NOTICE: only for MIM/HONEY LP (MIM -> HONEY), may be updated in the future
// NOTICE: TEST - calculations using the price will not be as accurate as possible 
const computeAddLiquidityProportion = async (
  lpAddress: Address,
  token0Amount: bigint,
  token1Amount: bigint
) => {
  const publicClient: PublicClient = getPublicClient(BERA_CHAIN_ID);

  const lpContractInfo = {
    address: lpAddress,
    abi: parseAbi([
      "function getUnderlyingBalances() view returns (uint256 amount0Current, uint256 amount1Current)",
    ]),
  };

  const [amount0Current, amount1Current] = await publicClient.readContract({
    ...lpContractInfo,
    functionName: "getUnderlyingBalances",
    args: [],
  });

  const tokensPrices = await getCoinsPrices(BERA_CHAIN_ID, [
    BERA_MIM_ADDRESS,
    BERA_HONEY_ADDRESS,
  ]);

  const token0Info = getTokenInfo(BERA_MIM_ADDRESS, amount0Current, tokensPrices);
  const token1Info = getTokenInfo(
    BERA_MIM_ADDRESS,
    amount1Current,
    tokensPrices
  );

  const tvl = token0Info.balanceUSD + token1Info.balanceUSD;

  const token0ProportionPercent = parseUnits(
    ((Number(token0Info.parsedBalance) / tvl) * 100).toFixed(2),
    PERCENT_PRESITION
  );

  const token1ProportionPercent = PERCENT_TARGET - token0ProportionPercent

  const token0ProportionAmount = token0Amount * token0ProportionPercent / PERCENT_TARGET;
  const token1ProportionAmount = token0Amount - token0ProportionAmount; // MIM to sell

  const proportions = {
    token0ProportionAmount,
    token1ProportionAmount
  }

  console.log("[computeAddLiquidityProportion] results: ", {
    token0Info,
    token1Info,
    token0ProportionPercent,
    token1ProportionPercent,
    proportions
  });

  return proportions;
};

const getTokenInfo = (
  address: Address,
  balance: bigint,
  prices: TokenPrice[],
  decimals = 18
) => {
  const price = prices.find((info) => info.address === address)!.price;
  const parsedBalance = formatUnits(balance, decimals);

  const balanceUSD = Number(parsedBalance) * price;

  return {
    address,
    balance,
    parsedBalance,
    balanceUSD,
    price,
  };
};

export default computeAddLiquidityProportion;
