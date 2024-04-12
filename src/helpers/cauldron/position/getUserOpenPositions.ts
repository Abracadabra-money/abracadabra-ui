import { markRaw } from "vue";
import { Contract } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import cauldronsConfig from "@/configs/cauldrons";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import type { CauldronPositionItem } from "@/helpers/cauldron/types";
import { getUserPositions } from "@/helpers/cauldron/getUserPositions";

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

      const provider = markRaw(getEthersProvider(chainId));

      // const multicallProvider = MulticallWrapper.wrap(provider);
      // NOTICE: BERA TEST
      const multicallProvider =
        +chainId === 80085 ? provider : MulticallWrapper.wrap(provider);

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
        chainId
      );

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
