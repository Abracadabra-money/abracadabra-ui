import { getMagicLvlStatistics } from "@/helpers/stake/magicLvl/subgraph/getMagicLvlStatistics";
import { utils } from "ethers";

export const getAdditionalInfo = async (stakeInfo: any) => {
  const { juniorApy, mezzanineApy, seniorApy, junior, mezzanine, senior } =
    await getMagicLvlStatistics();

  const { totalRewards: juniorTotalRewards, lpPriceUsd: juniorLpPriceUsd } =
    junior;

  const juniorTotalRewardsUsd =
    +utils.formatUnits(juniorTotalRewards) * +juniorLpPriceUsd;

  const {
    totalRewards: mezzanineTotalRewards,
    lpPriceUsd: mezzanineLpPriceUsd,
  } = mezzanine;

  const mezzanineTotalRewardsUsd =
    +utils.formatEther(mezzanineTotalRewards) * +mezzanineLpPriceUsd;

  const { totalRewards: seniorTotalRewards, lpPriceUsd: seniorLpPriceUsd } =
    senior;

  const seniorTotalRewardsUsd =
    +utils.formatEther(seniorTotalRewards) * +seniorLpPriceUsd;

  const totalRewardsUsd =
    juniorTotalRewardsUsd + mezzanineTotalRewardsUsd + seniorTotalRewardsUsd;

  const { totalSupplyUsd: seniorTotalSupplyUsd } = stakeInfo.senior.mainToken;
  const { totalSupplyUsd: mezzanineTotalSupplyUsd } =
    stakeInfo.mezzanine.mainToken;
  const { totalSupplyUsd: juniorTotalSupplyUsd } = stakeInfo.junior.mainToken;

  const totalSupplyUsd =
    seniorTotalSupplyUsd + mezzanineTotalSupplyUsd + juniorTotalSupplyUsd;

  return {
    tranchesStatistics: {
      seniorApy,
      mezzanineApy,
      juniorApy,
      seniorTotalRewardsUsd,
      mezzanineTotalRewardsUsd,
      juniorTotalRewardsUsd,
      totalRewardsUsd,
      totalSupplyUsd: totalSupplyUsd,
    },
  };
};
