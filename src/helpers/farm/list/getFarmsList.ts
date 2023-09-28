import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { getAccount } from "@wagmi/core";

import farmsConfig from "@/utils/farmsConfig/farms";
import type { Address } from "viem";

export const getFarmsList = async (chainId: number, isExtended = true) => {
  const account: Address | undefined = await getAccount().address;

  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );

  const farmsList = await Promise.all(
    farmsOnChain.map(async (farm) =>
      createFarmItemConfig(farm.id, chainId!, account, isExtended)
    )
  );

  return farmsList;
};
