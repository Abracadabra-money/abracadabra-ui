import { getNetwork } from "@wagmi/core";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";

import farmsConfig from "@/utils/farmsConfig/farms";

export const getFarmsList = async (signer: any, isExtended = true) => {
  const chainId = await getNetwork().chain?.id;

  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );

  const farmsList = await Promise.all(
    farmsOnChain.map(async (farm) =>
      createFarmItemConfig(farm.id, chainId!, signer, isExtended)
    )
  );

  return farmsList;
};
