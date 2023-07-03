import type { providers, BigNumber } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getMainParams } from "@/helpers/cauldron/getMainParams";
import cauldronsConfig from "@/utils/cauldronsConfig";

type CauldronListItem = {
  config: object;
  borrowFee: number;
  interest: number;
  liquidationFee: number;
  collateralPrice: BigNumber;
  mimLeftToBorrow: BigNumber;
  maximumCollateralRatio: BigNumber;
  oracleExchangeRate: BigNumber;
  totalBorrowed: BigNumber;
  tvl: BigNumber;
  userMaxBorrow: BigNumber;
};

export const getMarketList = async (
  chainId: number,
  provider: providers.BaseProvider
): Promise<CauldronListItem[]> => {
  const multicallProvider = MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const mainParams = await getMainParams(configs, multicallProvider);

  return configs.map((config, idx) => {
    return {
      config,
      ...mainParams[idx],
    };
  });
};
