import { Contract, utils, BigNumber, providers } from "ethers";

import cauldronsConfig from "@/utils/cauldronsConfig";
import bentoBoxAbi from "@/utils/abi/bentoBox";

import { getCauldronOracleRates } from "@/helpers/cauldron/exchangeRates";

import { checkIndividualPositionMulticall } from "./positionsMulticallExample";
import { checkIndividualPositionLens } from "./positionsLensExample";

import {
  getUserCollateralInfo,
  getUserBorrowInfo,
  getLiquidationPrice,
  type UserColalteralInfo,
  type UserBorrowInfo,
} from "@/helpers/cauldron/position";

type CauldronPositionItem = {
  config: object;
  oracleRate: BigNumber;
  collateralInfo: UserColalteralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number;
};

export const getUserCauldronPositions = async (
  chainId: number,
  user: string,
  provider: providers.BaseProvider
) => {
  const filteredByChain: object[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const start = new Date();
  const multicallResult = await checkIndividualPositionMulticall(provider, user, filteredByChain);
  const end = new Date();

  const start2 = new Date();
  const cauldrons: CauldronPositionItem[] = await Promise.all(
    filteredByChain.map((cauldron) =>
      checkIndividualPosition(cauldron, user, provider)
    )
  );
  const end2 = new Date();

  const start3 = new Date();
  const lensResult = await checkIndividualPositionLens(provider, user, filteredByChain);
  const end3 = new Date();

  console.log("__________cycle start__________")

  console.log("multicall duration:", +end - +start)
  console.log("basic optimized duration:", +end2 - +start2)
  console.log("lens duration:", +end3 - +start3)

  // console.log("result multicall:", multicallResult)
  // console.log("result basic:", cauldrons);

  console.log("__________end__________")



  // const positions = multicallResult.filter((info) => {
  //   return (
  //     info.collateralInfo.userCollateralShare.gt(0) ||
  //     info.borrowInfo.userBorrowPart.gt(0)
  //   );
  // });

  // const statistics = getUserStatistics(positions);

  // console.log("userPositions", positions);
  // console.log("statistics", statistics);

  // return positions;
};

export const checkIndividualPosition = async (
  config: any,
  user: string,
  provider: providers.BaseProvider
): Promise<CauldronPositionItem> => {
  const cauldron = new Contract(
    config.contract.address,
    config.contract.abi,
    provider
  );

  const bentoBoxAddress = await cauldron.bentoBox();
  const bentoBox = new Contract(bentoBoxAddress, bentoBoxAbi, provider);

  const { oracleRate } = await getCauldronOracleRates(cauldron, provider);

  const collateralInfo = await getUserCollateralInfo(
    user,
    bentoBox,
    cauldron,
    config.collateralInfo.address
  );

  const borrowInfo = await getUserBorrowInfo(cauldron, user);

  const liquidationPrice = getLiquidationPrice(
    utils.formatUnits(
      collateralInfo.userCollateralShare,
      config.collateralInfo.decimals
    ),
    utils.formatUnits(borrowInfo.userBorrowPart),
    config.mcr
  );

  return {
    config,
    oracleRate,
    collateralInfo,
    borrowInfo,
    liquidationPrice,
  };
};

export const getUserStatistics = (
  positions: CauldronPositionItem[]
): object => {
  const COLLATERAL_PRECISION = 2;

  const collateralDeposited = positions.reduce((accumulator, position) => {
    const collateralValue = position.collateralInfo.userCollateralShare
      .mul(Math.pow(10, COLLATERAL_PRECISION))
      .div(position.oracleRate);
    return accumulator.add(collateralValue);
  }, BigNumber.from(0));

  const mimBorrowed = positions.reduce((accumulator, position) => {
    return accumulator.add(position.borrowInfo.userBorrowAmount);
  }, BigNumber.from(0));

  return {
    collateralDepositedInUsd: utils.formatUnits(
      collateralDeposited,
      COLLATERAL_PRECISION
    ),
    mimBorrowed: utils.formatUnits(mimBorrowed),
  };
};
