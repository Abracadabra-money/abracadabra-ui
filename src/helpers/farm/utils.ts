import farmsConfig from "@/configs/farms/farms";
import type { FarmConfig } from "@/configs/farms/types";

export const getFarmConfig = (
  farmId: number,
  chainId: number
): FarmConfig | undefined => {
  return farmsConfig.find(
    (farm: FarmConfig) => farm.id === farmId && farm.contractChain === chainId
  );
};
