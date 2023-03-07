import { ethers } from "ethers";
import { getTokenPriceByAddress } from "../priceHelper";
import { getStargateBasicApy } from "@/helpers/stargateFarmApy";

const DegenBoxAddress = "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce";
import DegenBoxAbi from "@/utils/abi/degenBox";
import mainnetStargateLPStrategyAbi from "@/utils/abi/MainnetStargateLPStrategy";
import stargatePoolAbi from "@/utils/abi/StargatePool";

const fetchBasicApy = async (provider, collateralAddress) => {
  const poolContract = new ethers.Contract(
    collateralAddress,
    JSON.stringify(stargatePoolAbi),
    provider
  );

  const poolId = (await poolContract.poolId()) - 1;

  const rewardPrice = await getTokenPriceByAddress(
    1,
    "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6" // Stargate token price
  );

  const price = ethers.utils.parseEther(String(rewardPrice));

  return await getStargateBasicApy(collateralAddress, poolId, price.toString());
};

export const getStargateApy = async (pool, provider) => {

  const collateralAddress = pool.collateralToken.contract.address

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
