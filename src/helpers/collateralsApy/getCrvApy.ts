import crvRewardPoolAbi from "@/abis/crvRewardPoolAbi";
import tokenCVXAbi from "@/abis/tokensAbi/CVX";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { type Address, formatUnits, type PublicClient } from "viem";
import { MAINNET_CHAIN_ID, ONE_ETHER_VIEM } from "@/constants/global";
import type { CauldronListItem } from "../cauldron/lists/getMarketList";

const NORMAL_DECIMALS = 18;
const ONE_IN_NORMAL_DECIMALS = ONE_ETHER_VIEM;

const getCrvApy = async (pool: CauldronListItem, baseRewardPoolAddress: Address) => {
  try {
    const publicClient = getPublicClient(MAINNET_CHAIN_ID)

    const [rewardRate, totalSupply] = await publicClient.multicall({
      contracts: [
        {
          address: baseRewardPoolAddress,
          abi: crvRewardPoolAbi,
          functionName: "rewardRate"
        },
        {
          address: baseRewardPoolAddress,
          abi: crvRewardPoolAbi,
          functionName: "totalSupply"
        },
      ]
    })

    const rewardRateBigint = rewardRate.result as bigint;
    const totalSupplyBigint = totalSupply.result as bigint;

    const tokenIn1000Usd = 1000n * pool.mainParams.alternativeData.oracleExchangeRate;

    const secondsPerYear = 31536000n;

    const crvReward =
      ((rewardRateBigint * ONE_IN_NORMAL_DECIMALS / totalSupplyBigint) * tokenIn1000Usd * secondsPerYear) / ONE_IN_NORMAL_DECIMALS;

    const cvxReward = await convertCrvToCvx(crvReward, publicClient);

    const formattedCrvReward = Number(formatUnits(crvReward, NORMAL_DECIMALS));
    const formattedCvxReward = Number(formatUnits(cvxReward, NORMAL_DECIMALS));

    const [crvPrice, cvxPrice] = await Promise.all([
      getTokenPriceByChain(
        tokensChainLink.crv.chainId,
        tokensChainLink.crv.address
      ),
      getTokenPriceByChain(
        tokensChainLink.cvx.chainId,
        tokensChainLink.cvx.address
      )]);

    const apy = (formattedCrvReward * crvPrice + formattedCvxReward * cvxPrice) / 10;
    return apy;
  } catch (e) {
    console.log("getCrvToCvx err", e);
  }
};

const convertCrvToCvx = async (amount: bigint, publicClient: PublicClient) => {
  try {
    const cvxTokenContract =
    {
      address: "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" as Address,
      abi: tokenCVXAbi
    };


    const [
      supplyResponse,
      reductionPerCliffResponse,
      totalCliffsResponse,
      maxSupplyResponse
    ] = await publicClient.multicall({
      contracts: [
        {
          ...cvxTokenContract,
          functionName: "totalSupply"
        },
        {
          ...cvxTokenContract,
          functionName: "reductionPerCliff"
        },
        {
          ...cvxTokenContract,
          functionName: "totalCliffs"
        },
        {
          ...cvxTokenContract,
          functionName: "maxSupply"
        },
      ]
    })
    const supply = supplyResponse.result as bigint;
    const reductionPerCliff = reductionPerCliffResponse.result as bigint;
    const totalCliffs = totalCliffsResponse.result as bigint;
    const maxSupply = maxSupplyResponse.result as bigint;
    const cliff = supply / reductionPerCliff;
    //mint if below total cliffs
    if (cliff > totalCliffs) {
      //for reduction% take inverse of current cliff
      const reduction = totalCliffs - cliff;
      //reduce
      amount = amount * reduction / totalCliffs;
      //supply cap check
      const amtTillMax = maxSupply - supply;

      if (amount > amtTillMax) {
        amount = amtTillMax;
      }
      //mint
      return amount;
    }
    return 0n;
  } catch (e) {
    console.log("ConvertCrvToCvx err:", e);
    return 0n;
  }
};

export { getCrvApy };
