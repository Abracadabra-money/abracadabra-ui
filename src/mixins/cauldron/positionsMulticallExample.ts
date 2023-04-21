import { Contract, utils, BigNumber, providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import bentoBoxAbi from "@/utils/abi/bentoBox";
import oracleAbi from "@/utils/abi/oracle";

import {
  getUserBorrowInfoAlternative,
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

export const checkIndividualPositionMulticall = async (
  provider: providers.BaseProvider,
  user: string,
  configs: any[]
): Promise<CauldronPositionItem[]> => {
  const multicalProvider = MulticallWrapper.wrap(provider);

  const cauldrons = configs.map((config: any) => {
    return new Contract(
      config.contract.address,
      config.contract.abi,
      multicalProvider
    );
  });

  const boxAddresses = await Promise.all(
    cauldrons.map((cauldron) => cauldron.bentoBox())
  );

  const boxContracts = boxAddresses.map((address: string, idx) => {
    return new Contract(address, bentoBoxAbi, multicalProvider);
  });

  const oracles = await Promise.all(
    cauldrons.map((cauldron) => cauldron.oracle())
  );

  const oraclesData = await Promise.all(
    cauldrons.map((cauldron) => cauldron.oracleData())
  );

  const oracleContracts = oracles.map((address: string, idx) => {
    return new Contract(address, oracleAbi, multicalProvider);
  });

  const oracleRates = await Promise.all(
    oracleContracts.map((contract, idx) => contract.peekSpot(oraclesData[idx]))
  );

  const userCollateralShares = await Promise.all(
    cauldrons.map((contract) => contract.userCollateralShare(user))
  );

  const userCollateralAmounts = await Promise.all(
    boxContracts.map((contract, idx) =>
      contract.toAmount(
        configs[idx].collateralInfo.address,
        userCollateralShares[idx],
        false
      )
    )
  );

  const userBorrowParts = await Promise.all(
    cauldrons.map((contract) => contract.userBorrowPart(user))
  );

  const totalBorrows = await Promise.all(
    cauldrons.map((contract) => contract.totalBorrow())
  );

  const accrueInfos = await Promise.all(
    cauldrons.map((contract) => contract.accrueInfo())
  );

  const userBorrowInfos = userBorrowParts.map((userBorrowPart, idx) =>
    getUserBorrowInfoAlternative(
      userBorrowPart,
      totalBorrows[idx],
      accrueInfos[idx]
    )
  );

  const liquidationPriceArr = configs.map((config, idx) =>
    getLiquidationPrice(
      utils.formatUnits(
        userCollateralShares[idx],
        config.collateralInfo.decimals
      ),
      utils.formatUnits(userBorrowParts[idx]),
      config.mcr
    )
  );

  return configs.map((config, idx) => {
    return {
      config,
      oracleRate: oracleRates[idx],
      collateralInfo: {
        userCollateralShare: userCollateralShares[idx],
        userCollateralAmount: userCollateralAmounts[idx],
      },
      borrowInfo: userBorrowInfos[idx],
      liquidationPrice: liquidationPriceArr[idx],
    };
  });
};
