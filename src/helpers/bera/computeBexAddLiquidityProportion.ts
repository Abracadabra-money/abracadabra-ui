import BexWeightedPoolAbi from "@/abis/tokensAbi/WeightedPool";
import { getTokenInfo } from "./computeAddLiquidityProportion";
import { BERA_CHAIN_ID } from "@/constants/global";

import { type Address, type PublicClient, parseUnits, parseAbi } from "viem";

import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { erc20Abi } from "viem";

const PERCENT_TARGET = 1000000n;
const PERCENT_PRESITION = 4;

export const computeBexAddLiquidityProportion = async (
  bexLpAddress: Address,
  mimAmount: bigint
) => {
  const publicClient: PublicClient = getPublicClient(BERA_CHAIN_ID);

  const lpContractInfo = {
    address: bexLpAddress,
    abi: BexWeightedPoolAbi,
  };

  const [vaultAddress, poolId] = await publicClient.multicall({
    contracts: [
      {
        ...lpContractInfo,
        functionName: "getVault",
        args: [],
      },
      {
        ...lpContractInfo,
        functionName: "getPoolId",
        args: [],
      },
    ],
  });

  if (!vaultAddress.result || !poolId.result) {
    throw new Error("Bex vault or poolId not found");
  }

  const vaultContractInfo = {
    address: vaultAddress.result,
    abi: parseAbi([
      "function getPoolTokens(bytes32 poolId) view returns (address[] tokens, uint256[] balances, uint256 lastChangeBlock)",
    ]),
  };

  const poolTokensInfo = await publicClient.readContract({
    ...vaultContractInfo,
    functionName: "getPoolTokens",
    args: [poolId.result],
  });

  const [token0Decimals, token1Decimals] = await publicClient.multicall({
    contracts: [
      {
        address: poolTokensInfo[0][0],
        abi: erc20Abi,
        functionName: "decimals",
        args: [],
      },
      {
        address: poolTokensInfo[0][1],
        abi: erc20Abi,
        functionName: "decimals",
        args: [],
      },
    ],
  });

  const tokens = poolTokensInfo[0] as Address[];
  const balances = poolTokensInfo[1] as bigint[];

  const tokensPrices = await getCoinsPrices(BERA_CHAIN_ID, tokens);

  const token0Info = getTokenInfo(
    tokens[0],
    balances[0],
    tokensPrices,
    token0Decimals.result
  );
  const token1Info = getTokenInfo(
    tokens[1],
    balances[1],
    tokensPrices,
    token1Decimals.result
  );

  const tvl = token0Info.balanceUSD + token1Info.balanceUSD;

  const token0ProportionPercent = parseUnits(
    ((Number(token0Info.balanceUSD) / tvl) * 100).toFixed(2),
    PERCENT_PRESITION
  );

  const token1ProportionPercent = PERCENT_TARGET - token0ProportionPercent;

  const token0ProportionAmount =
    (mimAmount * token0ProportionPercent) / PERCENT_TARGET;
  const token1ProportionAmount = mimAmount - token0ProportionAmount;

  const proportions = {
    token0ProportionAmount,
    token1ProportionAmount,
  };

  console.log("[computeAddLiquidityProporti n] results: ", {
    token0Info,
    token1Info,
    token0ProportionPercent,
    token1ProportionPercent,
    proportions,
  });

  return { proportions, token0Info, token1Info };
};
