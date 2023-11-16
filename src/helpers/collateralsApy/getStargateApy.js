import { ethers } from "ethers";
import DegenBoxAbi from "@/utils/abi/degenBox";
import stargatePoolAbi from "@/utils/abi/StargatePool";
import { tokensChainLink } from "@/utils/chainLink/config";
import { getStargateBasicApy } from "@/helpers/stargateFarmApy";
import { getTokenPriceByChain } from "@/helpers/getTokenPriceByChain";
import mainnetStargateLPStrategyAbi from "@/utils/abi/MainnetStargateLPStrategy";

const DegenBoxAddress = "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce";

const fetchBasicApy = async (provider, collateralAddress) => {
  const poolContract = new ethers.Contract(
    collateralAddress,
    JSON.stringify(stargatePoolAbi),
    provider
  );

  const poolId = (await poolContract.poolId()) - 1;

  const rewardPrice = await getTokenPriceByChain(
    tokensChainLink.stg.chainId,
    tokensChainLink.stg.address
  );

  const price = ethers.utils.parseEther(String(rewardPrice));

  return await getStargateBasicApy(collateralAddress, poolId, price.toString());
};

export const getStargateApy = async (pool, provider) => {
  const collateralAddress = pool.config.collateralInfo.address;

  const DegenBoxContract = new ethers.Contract(
    DegenBoxAddress,
    JSON.stringify(DegenBoxAbi),
    provider
  );

  const basicApy = (await fetchBasicApy(provider, collateralAddress)) * 100;

  const { targetPercentage } = await DegenBoxContract.strategyData(
    collateralAddress
  );
  const farmingPercentage = targetPercentage / 100;

  const strategyAddress = await DegenBoxContract.strategy(collateralAddress);

  const strategyContract = new ethers.Contract(
    strategyAddress,
    JSON.stringify(mainnetStargateLPStrategyAbi),
    provider
  );

  const fee = (await strategyContract.feePercent()) / 100;

  const apy = basicApy * farmingPercentage * (1 - fee);

  return apy;
};
