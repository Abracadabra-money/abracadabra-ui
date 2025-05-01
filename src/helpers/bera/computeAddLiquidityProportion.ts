import type { Address, PublicClient } from "viem";
import { BERA_CHAIN_ID } from "@/constants/global";
import { formatUnits, parseUnits, parseAbi } from "viem";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import type { TokenPrice } from "@/helpers/prices/defiLlama";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

const PERCENT_TARGET = 1000000n;
const PERCENT_PRESITION = 4;

const computeAddLiquidityProportion = async (
  lpAddress: Address,
  amount: bigint
) => {
  const publicClient: PublicClient = getPublicClient(BERA_CHAIN_ID);

  const lpContractInfo = {
    address: lpAddress,
    abi: parseAbi([
      "function getUnderlyingBalances() view returns (uint256 amount0Current, uint256 amount1Current)",
      "function token0() view returns (address token0)",
      "function token1() view returns (address token1)",
    ]),
  };

  const [
    { result: underlyingBalances },
    { result: token0Address },
    { result: token1Address },
  ] = await publicClient.multicall({
    contracts: [
      {
        ...lpContractInfo,
        functionName: "getUnderlyingBalances",
        args: [],
      },
      {
        ...lpContractInfo,
        functionName: "token0",
        args: [],
      },
      {
        ...lpContractInfo,
        functionName: "token1",
        args: [],
      },
    ],
  });

  const [decimals0, decimals1] = await publicClient.multicall({
    contracts: [
      {
        address: token0Address as Address,
        abi: parseAbi(["function decimals() view returns (uint256 decimals)"]),
        functionName: "decimals",
        args: [],
      },
      {
        address: token1Address as Address,
        abi: parseAbi(["function decimals() view returns (uint256 decimals)"]),
        functionName: "decimals",
        args: [],
      },
    ],
  });

  const amount0Current = !!underlyingBalances ? underlyingBalances[0] : 0n;
  const amount1Current = !!underlyingBalances ? underlyingBalances[1] : 0n;

  const tokensPrices = await getCoinsPrices(BERA_CHAIN_ID, [
    token0Address!,
    token1Address!,
  ]);

  const token0Info = getTokenInfo(
    token0Address!,
    amount0Current,
    tokensPrices,
    Number(decimals0.result)
  );

  const token1Info = getTokenInfo(
    token1Address!,
    amount1Current,
    tokensPrices,
    Number(decimals1.result)
  );

  const tvl = token0Info.balanceUSD + token1Info.balanceUSD;

  const token0ProportionPercent = parseUnits(
    ((Number(token0Info.balanceUSD) / tvl) * 100).toFixed(2),
    PERCENT_PRESITION
  );

  const token1ProportionPercent = PERCENT_TARGET - token0ProportionPercent;

  const token0ProportionAmount =
    (amount * token0ProportionPercent) / PERCENT_TARGET;
  const token1ProportionAmount = amount - token0ProportionAmount; // MIM to sell

  const proportions = {
    token0ProportionAmount,
    token1ProportionAmount,
  };

  console.log("[computeAddLiquidityProportion] results: ", {
    token0Info,
    token1Info,
    token0ProportionPercent,
    token1ProportionPercent,
    proportions,
  });

  return { proportions, token0Info, token1Info };
};

export const getTokenInfo = (
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
