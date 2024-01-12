import cauldronsConfig from "@/utils/cauldronsConfig";
import { Contract, providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import type { CauldronPositionItem } from "@/helpers/cauldron/types";

export const getUserOpenPositions = async (
  chainId: number,
  account: string,
  provider: providers.BaseProvider
): Promise<CauldronPositionItem[]> => {
  // NOTICE: BERA TEST
  const multicallProvider = provider; //ulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const cauldronContracts = configs.map((config: any) => {
    return new Contract(
      config.contract.address,
      config.contract.abi,
      multicallProvider
    );
  });

  const userPositions: any = await getUserPositions(
    configs,
    multicallProvider,
    account,
    cauldronContracts,
    chainId
  );

  const positions = userPositions.map((position: any, idx: any) => {
    return { config: configs[idx], ...position };
  });

  return positions.filter((info: any) => {
    return (
      info.collateralInfo.userCollateralShare.gt(0) ||
      info.borrowInfo.userBorrowPart.gt(0)
    );
  });
};
