import { BigNumber, providers, Contract } from "ethers";
import { RPC_ETH } from "@/constants/rpc";
import { Percent, CurrencyAmount, Token } from "@uniswap/sdk";

import lpStakingAbi from "@/utils/abi/StargateLPStaking";
import poolAbi from "@/utils/abi/StargatePool";

const provider = new providers.StaticJsonRpcProvider(RPC_ETH);
const YEAR = 31536000;

const stgToken = new Token(1, "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6", 18);
const susdc = new Token(1, "0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56", 6);
/**
 * Get APR for a Farm
 * @param rewardPrice Price of STG
 * @param stgPerBlock STG Reward per block
 * @param allocPoint Weight of the pool
 * @param totalAllocPoint Total weights of all pools in the contract
 * @param avgBlockTime Average block time
 * @param totalLiquidity Total liquidity deposited in Pool
 * @param totalFarmLp Total LP in the Farm
 * @param totalPoolLp Total LP in the Pool
 * @returns APR
 */
function getFarmApr(
  rewardPrice,
  stgPerBlock,
  allocPoint,
  totalAllocPoint,
  avgBlockTime,
  totalLiquidity,
  totalFarmLp,
  totalPoolLp
) {
  const rewardPerBlock = stgPerBlock.multiply(
    new Percent(allocPoint * 10000, totalAllocPoint * 10000)
  );
  const tvl = totalLiquidity.multiply(totalFarmLp).divide(totalPoolLp);
  const roiPerBlock = rewardPerBlock.multiply(rewardPrice).divide(tvl);
  const blocksPerYear = BigNumber.from(Math.floor(YEAR / avgBlockTime));
  const roiPerYear = roiPerBlock.multiply(blocksPerYear);
  return parseFloat(roiPerYear.toFixed(18));
}
/**
 * Get APY for a Farm
 * @param rewardPrice Price of STG
 * @param stgPerBlock STG Reward per block
 * @param allocPoint Weight of the pool
 * @param totalAllocPoint Total weights of all pools in the contract
 * @param avgBlockTime Average block time
 * @param totalLiquidity Total liquidity deposited in Pool
 * @param totalFarmLp Total LP in the Farm
 * @param totalPoolLp Total LP in the Pool
 * @returns APY
 */
function getFarmApy(
  rewardPrice,
  stgPerBlock,
  allocPoint,
  totalAllocPoint,
  avgBlockTime,
  totalLiquidity,
  totalFarmLp,
  totalPoolLp
) {
  const apr = getFarmApr(
    rewardPrice,
    stgPerBlock,
    allocPoint,
    totalAllocPoint,
    avgBlockTime,
    totalLiquidity,
    totalFarmLp,
    totalPoolLp
  );
  const apy = Math.E ** apr - 1;
  return apy;
}

export const getStargateBasicApy = async (poolAddress, poolId, price) => {
  const lpStakingContract = new Contract(
    "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
    lpStakingAbi,
    provider
  );
  const poolContract = new Contract(poolAddress, poolAbi, provider);

  const rewardPrice = new CurrencyAmount(stgToken, price);
  const stgPerBlock = new CurrencyAmount(
    stgToken,
    await lpStakingContract.stargatePerBlock()
  );
  const { allocPoint } = await lpStakingContract.poolInfo(poolId);
  const totalAllocPoint = await lpStakingContract.totalAllocPoint();
  const avgBlockTime = 13.25;
  const totalLiquidity = new CurrencyAmount(
    susdc,
    await poolContract.totalLiquidity()
  );
  const totalFarmLp = new CurrencyAmount(
    susdc,
    await poolContract.balanceOf(lpStakingContract.address)
  );
  const totalPoolLp = new CurrencyAmount(
    susdc,
    await poolContract.totalSupply()
  );

  const apy = getFarmApy(
    rewardPrice,
    stgPerBlock,
    allocPoint,
    totalAllocPoint,
    avgBlockTime,
    totalLiquidity,
    totalFarmLp,
    totalPoolLp
  );

  return apy;
};
