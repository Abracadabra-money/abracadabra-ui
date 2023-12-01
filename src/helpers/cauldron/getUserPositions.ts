import { Contract, BigNumber, utils } from "ethers";
import lensAbi from "@/utils/abi/marketLens.js";
import type { providers } from "ethers";
import type { UserPositions } from "@/helpers/cauldron/types";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";

import orderAbi from "@/utils/abi/gm/order";
import { ZERO_ADDRESS } from "@/constants/gm";
import bentoBoxAbi from "@/utils/abi/bentoBox";

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
  configs: Array<CauldronConfig | undefined>,
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
  const decimals: any = configs.map((config: any) => {
    return { decimals: config.collateralInfo.decimals };
  });

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

  const collaterallInOrders = await getOrdersCollateralBalance(
    //@ts-ignore
    configs,
    provider,
    account,
    cauldronContracts,
    chainId
  );

  return positions.map((position: any, idx: number) => {
    if (!position) return emptyPosition;

    return {
      collateralInfo: {
        userCollateralShare: userCollateralShares[idx].add(
          collaterallInOrders[idx].share
        ),
        userCollateralAmount: position.collateral.amount.add(
          collaterallInOrders[idx].amount
        ),
      },
      borrowInfo: {
        userBorrowAmount: position.borrowValue,
        userBorrowPart: userBorrowPart[idx],
      },
      // liquidationPrice: utils.formatUnits(
      //   position.liquidationPrice,
      //   configs[idx]?.collateralInfo.decimals
      // ),
      liquidationPrice: getLiquidationPrice(
        position.borrowValue,
        position.collateral.amount.add(collaterallInOrders[idx].amount),
        //@ts-ignore
        configs[idx].mcr
      ),
      oracleRate: oracleExchangeRate[idx],
    };
  });
};

const getLiquidationPrice = (
  borrowPart: BigNumber,
  collateralAmount: BigNumber,
  mcr: number
): number => {
  const borrowPartParsed = utils.formatUnits(borrowPart);
  const collateralAmountParsed = utils.formatUnits(collateralAmount);
  return (
    Number(borrowPartParsed) / Number(collateralAmountParsed) / (mcr / 100)
  );
};

const getOrdersCollateralBalance = async (
  configs: Array<CauldronConfig>,
  provider: providers.BaseProvider,
  account: string,
  cauldronContracts: Array<Contract>,
  chainId: number
) => {
  if (chainId !== 42161 || !account)
    return cauldronContracts.map(() => {
      return {
        share: BigNumber.from(0),
        amount: BigNumber.from(0),
      };
    });

  const bentoBoxAddress = "0x7C8FeF8eA9b1fE46A7689bfb8149341C90431D38"; //TODO

  const bentoBox = new Contract(bentoBoxAddress, bentoBoxAbi, provider);

  const orders = await Promise.all(
    configs.map((config: any, index) => {
      if (config.cauldronSettings.isGMXMarket)
        return cauldronContracts[index].orders(account);
      return ZERO_ADDRESS;
    })
  );

  const orderContracts = orders.map((order: any) => {
    const itsZero = order === ZERO_ADDRESS;

    return itsZero ? null : new Contract(order, orderAbi, provider);
  });

  const collaterallInOrders = await Promise.all(
    orderContracts.map((contract: any) => {
      return contract ? contract.orderValueInCollateral() : BigNumber.from(0);
    })
  );

  const collaterallInShare = await Promise.all(
    collaterallInOrders.map((amount: any, index) => {
      const collateral = configs[index].collateralInfo.address;
      return amount.gt(0)
        ? bentoBox.toShare(collateral, amount, false)
        : BigNumber.from(0);
    })
  );

  return collaterallInOrders.map((amount, index) => {
    return {
      amount,
      share: collaterallInShare[index],
    };
  });
};
