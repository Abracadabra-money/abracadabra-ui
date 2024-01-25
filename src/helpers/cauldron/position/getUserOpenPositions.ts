import cauldronsConfig from "@/utils/cauldronsConfig";
import { Contract, providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { defaultRpc } from "@/helpers/chains";

import type { CauldronPositionItem } from "@/helpers/cauldron/types";
import { markRaw } from "vue";

export const getUserOpenPositions = async (
  account: string,
  chains = null
): Promise<CauldronPositionItem[]> => {
  const currentChains = chains ? chains : Object.keys(defaultRpc);

  const positions: any = [];

  await Promise.all(
    currentChains.map(async (chainId: any) => {
      const configs: any[] = cauldronsConfig.filter(
        (config) => config.chainId == chainId
      );
      if (!configs) return [];

      const provider = markRaw(
        new providers.StaticJsonRpcProvider(
          defaultRpc[chainId as keyof typeof defaultRpc]
        )
      );
      const multicallProvider = MulticallWrapper.wrap(provider);

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

      const mainParams = await getMainParams(
        configs,
        multicallProvider,
        chainId,
      );

      positions.push(
        ...userPositions.map((position: any, idx: any) => {
          return { config: configs[idx], ...position, mainParams: mainParams[idx] };
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
