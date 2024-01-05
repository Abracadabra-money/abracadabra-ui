import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { getAccount } from "@wagmi/core";

import farmsConfig from "@/utils/farmsConfig/farms";
import type { Address } from "viem";

export const getFarmsList = async (chainId: number, isExtended = true) => {
  const account: Address | undefined = await getAccount().address;

  const farmsList = await Promise.all(
    farmsConfig.map(async (farm) =>
      createFarmItemConfig(farm.id, farm.contractChain, account, isExtended)
    )
  );

  return farmsList;
};
