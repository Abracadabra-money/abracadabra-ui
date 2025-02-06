import type { StakeListItem } from "@/types/stake/stakeList";
import { stakeListConfig } from "@/configs/stake/stakeListConfig";
import { stakeAPRGetters } from "@/helpers/stake/stakeList/aprGetters";

export const getStakeList = (): StakeListItem[] => {
  return stakeListConfig.map((config) => {
    return {
      ...config,
      fetchAPR:
        stakeAPRGetters[config.routerLinkName as keyof typeof stakeAPRGetters],
    };
  });
};
