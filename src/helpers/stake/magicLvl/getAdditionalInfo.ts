import { formatUnits } from "viem";
import type { MagicLvlAdditionalInfo } from "@/types/magicLvl/stakeInfo";
import { getMagicLvlStatistics } from "@/helpers/stake/magicLvl/subgraph/getMagicLvlStatistics";

export const getAdditionalInfo = async (
  stakeInfo: any
): Promise<MagicLvlAdditionalInfo> => {
  const decimals = 18;

  const { juniorApy, mezzanineApy, seniorApy, junior, mezzanine, senior } =
    await getMagicLvlStatistics();

  const { totalRewards: juniorTotalRewards, lpPriceUsd: juniorLpPriceUsd } =
    junior;

  const juniorTotalRewardsUsd =
    +formatUnits(juniorTotalRewards, decimals) * +juniorLpPriceUsd;

  const {
    totalRewards: mezzanineTotalRewards,
    lpPriceUsd: mezzanineLpPriceUsd,
  } = mezzanine;

  const mezzanineTotalRewardsUsd =
    +formatUnits(mezzanineTotalRewards, decimals) * +mezzanineLpPriceUsd;

  const { totalRewards: seniorTotalRewards, lpPriceUsd: seniorLpPriceUsd } =
    senior;

  const seniorTotalRewardsUsd =
    +formatUnits(seniorTotalRewards, decimals) * +seniorLpPriceUsd;

  const totalRewardsUsd =
    juniorTotalRewardsUsd + mezzanineTotalRewardsUsd + seniorTotalRewardsUsd;

  const { totalSupplyUsd: seniorTotalSupplyUsd } = stakeInfo.senior.mainToken;
  const { totalSupplyUsd: mezzanineTotalSupplyUsd } =
    stakeInfo.mezzanine.mainToken;
  const { totalSupplyUsd: juniorTotalSupplyUsd } = stakeInfo.junior.mainToken;

  const totalSupplyUsd: bigint =
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
