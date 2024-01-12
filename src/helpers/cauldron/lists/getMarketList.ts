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
  account: string,
  chainId: number,
  provider: providers.BaseProvider
): Promise<CauldronListItem[]> => {
  // NOTICE: BERA TEST
  const multicallProvider = provider; //ulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter((config) => {
    let result = config.chainId === +chainId;

    if (config.cauldronSettings.isPrivate)
      result = config.cauldronSettings.privatelyFor!.some(
        (walletAddress) => walletAddress === account
      );

    return result;
  });

  const mainParams = await getMainParams(configs, multicallProvider, chainId);

  return configs.map((config, idx) => {
    return {
      config,
      ...mainParams[idx],
    };
  });
};
