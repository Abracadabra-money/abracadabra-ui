import { Contract, BigNumber, utils } from "ethers";
import lensAbi from "@/utils/abi/marketLens.js";
import type { providers } from "ethers";
import type { UserPositions } from "@/helpers/cauldron/types";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";

const emptyPosition = {
  oracleRate: BigNumber.from("0"),
  collateralInfo: {
    userCollateralShare: BigNumber.from("0"),
    userCollateralAmount: BigNumber.from("0"),
  },
  borrowInfo: {
    userBorrowAmount: BigNumber.from("0"),
    userBorrowPart: BigNumber.from("0"),
  },
  liquidationPrice: "0",
};

export const getUserPositions = async (
  configs: Array<Object | undefined>,
  provider: providers.BaseProvider,
  account: string | undefined,
  cauldronContracts: Array<Contract | undefined>,
  chainId: number
): Promise<Array<UserPositions>> => {
  if (!account) configs.map(() => emptyPosition);

  const lensAddress = getLensAddress(chainId);
  const lensContract = new Contract(lensAddress, lensAbi, provider);

  const positions = await Promise.all(
    configs.map((config: any) => {
      return lensContract
        .getUserPosition(config.contract.address, account)
        .catch(() => null);
    })
  );

  const oracleExchangeRate = await Promise.all(
    configs.map((config: any) => {
      return lensContract
        .getOracleExchangeRate(config.contract.address)
        .catch(() => "0x00");
    })
  );

  const userCollateralShares = await Promise.all(
    cauldronContracts.map((contract: any) =>
      contract.userCollateralShare(account).catch(() => "0x00")
    )
  );

  const userBorrowPart = await Promise.all(
    cauldronContracts.map((contract: any) =>
      contract.userBorrowPart(account).catch(() => "0x00")
    )
  );

  return positions.map((position: any, idx: number) => {
    if (!position) return emptyPosition;

    return {
      collateralInfo: {
        userCollateralShare: userCollateralShares[idx],
        userCollateralAmount: position.collateral.amount,
      },
      borrowInfo: {
        userBorrowAmount: position.borrowValue,
        userBorrowPart: userBorrowPart[idx],
      },
      liquidationPrice: utils.formatUnits(position.liquidationPrice),
      oracleRate: oracleExchangeRate[idx],
    };
  });
};
