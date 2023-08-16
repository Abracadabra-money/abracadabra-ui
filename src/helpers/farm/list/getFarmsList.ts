import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { getAccount } from "@wagmi/core";

import farmsConfig from "@/utils/farmsConfig/farms";
import type { Signer } from "ethers";

export const getFarmsList = async (
  chainId: number,
  signer: Signer,
  isExtended = true
) => {
  const account: string | undefined = await getAccount().address;

  const farmsOnChain = farmsConfig.filter(
    (farm) => farm.contractChain === chainId
  );

  const farmsList = await Promise.all(
    farmsOnChain.map(async (farm) =>
      createFarmItemConfig(farm.id, chainId!, signer, account, isExtended)
    )
  );

  return farmsList;
};
