import { Contract, providers, utils } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";

import cauldronsConfig from "@/utils/cauldronsConfig";
import bentoBoxAbi from "@/utils/abi/bentoBox";

import { getMaxToBorrow } from "@/helpers/cauldron/getMaxToBorrow";
import { getTotalBorrowed } from "@/helpers/cauldron/getTotalBorrowed";

const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
import lensAbi from "@/utils/abi/marketLens.js";

type CauldronListItem = {
  config: object;
  interest: number;
  tvl: string;
  totalBorrowed: string;
  MIMsLeftToBorrow: string;
};

export const getMarketList = async (
  chainId: number,
  provider: providers.BaseProvider
): Promise<CauldronListItem[]> => {
  const multicalProvider = MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const lensContract = new Contract(lensAddress, lensAbi, multicalProvider);

  const cauldronContracts = configs.map((config: any) => {
    return new Contract(
      config.contract.address,
      config.contract.abi,
      multicalProvider
    );
  });

  const boxAddresses = await Promise.all(
    cauldronContracts.map((cauldron) => cauldron.bentoBox())
  );

  const boxContracts = boxAddresses.map((address: string) => {
    return new Contract(address, bentoBoxAbi, multicalProvider);
  });

  const oracleRates = await Promise.all(
    configs.map((config) =>
      lensContract.getOracleExchangeRate(config.contract.address)
    )
  );

  const totalCollateralShares = await Promise.all(
    cauldronContracts.map((contract) => contract.totalCollateralShare())
  );

  const totalCollateralAmounts = await Promise.all(
    boxContracts.map((contract, idx) =>
      contract.toAmount(
        configs[idx].collateralInfo.address,
        totalCollateralShares[idx],
        false
      )
    )
  );

  const totalBorrowArr = await Promise.all(
    cauldronContracts.map((contract) => contract.totalBorrow())
  );

  const accrueInfoArr = await Promise.all(
    cauldronContracts.map((contract) => contract.accrueInfo())
  );

  const mimCauldronShares = await Promise.all(
    configs.map((config, idx) =>
      boxContracts[idx].balanceOf(
        config.mimInfo.address,
        config.contract.address
      )
    )
  );

  const mimCauldronAmounts = await Promise.all(
    configs.map((config, idx) =>
      boxContracts[idx].toAmount(
        config.mimInfo.address,
        mimCauldronShares[idx],
        false
      )
    )
  );

  const borrowLimitArr = await Promise.all(
    cauldronContracts.map((contract) =>
      Object.prototype.hasOwnProperty.call(contract, "borrowLimit")
        ? contract.borrowLimit()
        : false
    )
  );

  const totalBorrowedArr = configs.map((_, idx) =>
    getTotalBorrowed(totalBorrowArr[idx], accrueInfoArr[idx])
  );

  const MIMsLeftToBorrowArr = await Promise.all(
    configs.map((config, idx) =>
      getMaxToBorrow(
        utils.formatUnits(mimCauldronAmounts[idx]),
        borrowLimitArr[idx],
        totalBorrowedArr[idx],
        config.cauldronSettings
      )
    )
  );

  const interestArr = await Promise.all(
    configs.map(({ interest, contract }) =>
      interest
        ? interest * 100
        : lensContract.getInterestPerYear(contract.address)
    )
  );

  const tvlArr = configs.map((_, idx) =>
    totalCollateralAmounts[idx].div(oracleRates[idx]).toString()
  );

  return configs.map((config, idx) => {
    return {
      config,
      interest: interestArr[idx] / 100,
      tvl: tvlArr[idx],
      totalBorrowed: totalBorrowedArr[idx],
      MIMsLeftToBorrow: MIMsLeftToBorrowArr[idx].toString(),
    };
  });
};
