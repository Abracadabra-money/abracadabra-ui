import farmsConfig from "@/configs/farms/farms";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { createFarmItemConfig } from "@/helpers/farm/createFarmItemConfig";

export const getFarmsList = async (chainId: number, isExtended = true) => {
  const { address } = await getAccountHelper();

  return await Promise.all(
    farmsConfig.map(async (farm) =>
      createFarmItemConfig(farm.id, farm.contractChain, address, isExtended)
    )
  );
};
