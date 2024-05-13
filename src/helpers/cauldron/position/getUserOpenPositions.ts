import { defaultRpc } from "@/helpers/chains";
import cauldronsConfig from "@/configs/cauldrons";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import type { CauldronPositionItem } from "@/helpers/cauldron/types";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";

export const getUserOpenPositions = async (
  account: string,
  chains = null
): Promise<CauldronPositionItem[]> => {
  const currentChains = chains ? chains : Object.keys(defaultRpc);

  const positions: any = [];

  await Promise.all(
    currentChains.map(async (chainId: string) => {
      const configs: any[] = cauldronsConfig.filter(
        (config) => config.chainId === Number(chainId)
      );
      if (!configs) return [];

      const userPositions: any = await getUserPositions(
        configs,
        account,
        Number(chainId)
      );

      const mainParams = await getMainParams(configs, Number(chainId));

      positions.push(
        ...userPositions.map((position: any, idx: any) => {
          return {
            config: configs[idx],
            ...position,
            mainParams: mainParams[idx],
          };
        })
      );
    })
  );

  return positions.filter((position: any) => {
    return (
      position.collateralInfo.userCollateralShare.gt(0) ||
      position.borrowInfo.userBorrowPart.gt(0)
    );
  });
};
