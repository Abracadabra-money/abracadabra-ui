import { Contract, utils, BigNumber, providers } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import cauldronsConfig from "@/utils/cauldronsConfig";
import bentoBoxAbi from "@/utils/abi/bentoBox";

import { getUserBorrowInfo, type UserBorrowInfo} from "./getUserBorrowInfo";
import type { UserColalteralInfo  } from "./getUserCollateralInfo";
import { getLiquidationPrice } from "./getUserLiquidationPrice";

const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
import lensAbi from "@/utils/abi/marketLens.js"

type CauldronPositionItem = {
  config: object;
  oracleRate: BigNumber;
  collateralInfo: UserColalteralInfo;
  borrowInfo: UserBorrowInfo;
  liquidationPrice: number;
};

export const getUserPositions = async (
  chainId: number,
  user: string,
  provider: providers.BaseProvider,
): Promise<CauldronPositionItem[]> => {
  const multicalProvider = MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );
  
  const lensContract = new Contract(
    lensAddress,
    lensAbi,
    multicalProvider
  );

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
    configs.map((config) => lensContract.getOracleExchangeRate(config.contract.address))
  );

  const userCollateralShares = await Promise.all(
    cauldronContracts.map((contract) => contract.userCollateralShare(user))
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
    cauldronContracts.map((contract) => contract.userBorrowPart(user))
  );

  const totalBorrows = await Promise.all(
    cauldronContracts.map((contract) => contract.totalBorrow())
  );

  const accrueInfoArr = await Promise.all(
    cauldronContracts.map((contract) => contract.accrueInfo())
  );

  const userBorrowInfoArr = userBorrowParts.map((userBorrowPart, idx) =>
    getUserBorrowInfo(
      userBorrowPart,
      totalBorrows[idx],
      accrueInfoArr[idx]
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

  const allPositions = configs.map((config, idx) => {
    return {
      config,
      oracleRate: oracleRates[idx],
      collateralInfo: {
        userCollateralShare: userCollateralShares[idx],
        userCollateralAmount: userCollateralAmounts[idx],
      },
      borrowInfo: userBorrowInfoArr[idx],
      liquidationPrice: liquidationPriceArr[idx],
    };
  });

  const openPositions = allPositions.filter((info) => {
    return (
      info.collateralInfo.userCollateralShare.gt(0) ||
      info.borrowInfo.userBorrowPart.gt(0)
    );
  });

  return openPositions;
};
