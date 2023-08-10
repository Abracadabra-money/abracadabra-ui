import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";
import { getAccount } from "@wagmi/core";

import farmsConfig from "@/utils/farmsConfig/farms";

export const getFarmsList = async (
  chainId: number,
  signer: any,
  isExtended = true
) => {
  let account: string | undefined = await getAccount().address;

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
