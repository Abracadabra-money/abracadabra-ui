import cauldronsConfig from "@/utils/cauldronsConfig";
import { Contract, BigNumber, providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getUserPosition } from "@/helpers/cauldron/getUserPosition";
import type { UserBorrowInfo } from "./getUserBorrowInfo";
import type { UserCollateralInfo } from "./getUserCollateralInfo";

type CauldronPositionItem = {
  config: object;
  oracleRate: BigNumber;
  collateralInfo: UserCollateralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number;
};

export const getUserPositions = async (
  chainId: number,
  account: string,
  provider: providers.BaseProvider
): Promise<CauldronPositionItem[]> => {
  const multicallProvider = MulticallWrapper.wrap(provider);

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

  const userPositions: any = await getUserPosition(
    configs,
    multicallProvider,
    account,
    cauldronContracts
  );

  const positions = userPositions.map((position: any, idx: any) => {
    return { ...configs[idx], ...position };
  });

  return positions.filter((info: any) => {
    return (
      info.collateralInfo.userCollateralShare.gt(0) ||
      info.borrowInfo.userBorrowPart.gt(0)
    );
  });
};
