import { Contract, providers, utils } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";

import cauldronsConfig from "@/utils/cauldronsConfig";

const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
import lensAbi from "@/utils/abi/marketLens.js";

type CauldronListItem = {
  config: object;
  interest: number;
  tvl: string;
  totalBorrowed: string;
  mimLeftToBorrow: string;
};

export const getMarketList = async (
  chainId: number,
  provider: providers.BaseProvider
): Promise<CauldronListItem[]> => {
  const multicallProvider = MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const lensContract = new Contract(lensAddress, lensAbi, multicallProvider);

  const marketInfoResp = await Promise.all(
    configs.map((config) =>
      config.version === 2
        ? lensContract.getMarketInfoCauldronV2(config.contract.address)
        : lensContract.getMarketInfoCauldronV3(config.contract.address)
    )
  );

  const marketInfo = marketInfoResp.map((info) => {
    return {
      interest: Number(info.interestPerYear) / 100,
      tvl: utils.formatUnits(info.totalCollateral.value),
      totalBorrowed: utils.formatUnits(info.totalBorrowed),
      mimLeftToBorrow: utils.formatUnits(info.marketMaxBorrow),
      borrowFee: Number(info.borrowFee) / 100,
      liquidationFee: Number(info.liquidationFee) / 100,
    };
  });

  return configs.map((config, idx) => {
    return {
      config,
      ...marketInfo[idx]
    };
  });
};
