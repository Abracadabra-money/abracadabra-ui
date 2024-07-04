import farmsConfig from "@/configs/farms/farms";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { createFarmData } from "@/helpers/farm/createFarmData";

export const getFarmsList = async (isExtended = true) => {
  const { address } = await getAccountHelper();

  return await Promise.all(
    farmsConfig.map(async (farm) =>
      createFarmData(farm.id, farm.contractChain, address, isExtended)
    )
  );
};
