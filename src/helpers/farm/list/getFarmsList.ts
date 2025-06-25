import farmsConfig from "@/configs/farms/farms";
import { createFarmData } from "@/helpers/farm/createFarmData";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import type { Address } from "viem";

export const getFarmsList = async (address?: Address, isExtended = true) => {
  if (!address) {
    address = (await getAccountHelper()).address;
  }

  return await Promise.all(
    farmsConfig.map(async (farm) =>
      createFarmData(farm.id, farm.contractChain, address, isExtended)
    )
  );
};
