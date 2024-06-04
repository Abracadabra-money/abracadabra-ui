import { defaultRpc } from "@/helpers/chains";
import cauldronsConfig from "@/configs/cauldrons";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import type { MainParams, UserPositions } from "@/helpers/cauldron/types";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

export type UserOpenPosition = {
  config: CauldronConfig;
  mainParams: MainParams;
  apr?: number;
  positionHealth?: number;
  collateralDepositedUsd?: number;
  mimBorrowed?: number;
} & UserPositions;

export const getUserOpenPositions = async (
  account: string,
  chains = null
): Promise<UserOpenPosition[]> => {
  const currentChains = chains ? chains : Object.keys(defaultRpc);

  const positions: UserOpenPosition[] = [];

  await Promise.all(
    currentChains.map(async (chainId: string) => {
      const configs = cauldronsConfig.filter(
        (config) => config.chainId === Number(chainId)
      );
      if (!configs) return [];

      const userPositions = await getUserPositions(
        configs,
        account,
        Number(chainId)
      );

      const mainParams = await getMainParams(configs, Number(chainId));

      userPositions.forEach((position: UserPositions, idx: number) => {
        if (
          position.collateralInfo.userCollateralShare.gt(0) ||
          position.borrowInfo.userBorrowPart.gt(0)
        ) {
          positions.push({
            config: configs[idx],
            ...position,
            mainParams: mainParams[idx],
          });
        }
      });
    })
  );

  return positions;
};
