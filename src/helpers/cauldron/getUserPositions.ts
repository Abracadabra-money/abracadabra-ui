import { formatUnits } from "viem";
import type { Address } from "viem";
import orderAbi from "@/abis/gm/order";
import type { PublicClient } from "viem";
import { BigNumber, utils } from "ethers";
import lensAbi from "@/abis/marketLens.js";
import { ZERO_ADDRESS } from "@/constants/gm";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import degenBoxInfo from "@/configs/contracts/degenBox";
import type { UserPositions } from "@/helpers/cauldron/types";
import { getAlternativeLiquidationPrice } from "@/helpers/cauldron/utils";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import type { ExtendedContractInfo } from "@/configs/contracts/types";
import { getAlternativePositionHealth } from "@/helpers/cauldron/utils";

const emptyPosition: UserPositions = {
  oracleRate: 0n,
  collateralInfo: {
    userCollateralShare: 0n,
    userCollateralAmount: 0n,
  },
  borrowInfo: {
    userBorrowAmount: 0n,
    userBorrowPart: 0n,
  },
  liquidationPrice: 0,
  positionHealth: { percent: 0n, status: "high" },
  collateralDeposited: 0,
  collateralDepositedUsd: 0,
  mimBorrowed: 0,
  hasActiveGmOrder: false,
};

export const getUserPositions = async (
  configs: CauldronConfig[],
  account: Address | undefined,
  chainId: number
): Promise<Array<UserPositions>> => {
  if (!account) return configs.map(() => emptyPosition);

  const lensAddress: Address = getLensAddress(chainId);
  const publicClient: PublicClient = getPublicClient(chainId);

  const userPositions: any = await publicClient.multicall({
    contracts: configs
      .map((config: CauldronConfig) => {
        return [
          {
            address: lensAddress,
            abi: lensAbi,
            functionName: "getUserPosition",
            args: [config.contract.address, account],
          },
          {
            address: lensAddress,
            abi: lensAbi,
            functionName: "getOracleExchangeRate",
            args: [config.contract.address],
          },
          {
            address: config.contract.address,
            abi: config.contract.abi,
            functionName: "userCollateralShare",
            args: [account],
          },
          {
            address: config.contract.address,
            abi: config.contract.abi,
            functionName: "userBorrowPart",
            args: [account],
          },
        ];
      })
      .flat(2),
  });

  const collaterallInOrders = await getOrdersCollateralBalance(
    configs,
    account,
    chainId
  );

  return configs.map((config: CauldronConfig, index: number) => {
    if (!userPositions) return emptyPosition;

    const decimals = config.collateralInfo.decimals;
    const mcr = config.mcr;
    const oracleExchangeRate: bigint = userPositions[index * 4 + 1].result;
    const userCollateralShare: bigint = userPositions[index * 4 + 2].result;
    const collaterallInOrder = collaterallInOrders[index];
    const userBorrowPart: bigint = userPositions[index * 4 + 3].result;

    // EDGE CASE: if cauldron is empty
    const userPosition = userPositions[index * 4].error
      ? {
          borrowValue: 0n,
          collateral: {
            amount: userCollateralShare,
          },
        }
      : userPositions[index * 4].result;

    const collateralPrice =
      1 / Number(formatUnits(oracleExchangeRate, decimals));

    const liquidationPrice = getAlternativeLiquidationPrice(
      userPosition.borrowValue,
      userPosition.collateral.amount +
        BigInt(collaterallInOrders[index].amount),
      mcr,
      decimals
    );

    const positionHealth = getAlternativePositionHealth(
      liquidationPrice,
      oracleExchangeRate,
      decimals
    );

    const userCollateralAmount =
      userPosition.collateral.amount + collaterallInOrders[index].amount;

    const userBorrowAmount = userPosition.borrowValue;

    const collateralDeposited = Number(
      utils.formatUnits(userCollateralAmount, config?.collateralInfo.decimals)
    );

    const collateralDepositedUsd = collateralDeposited * collateralPrice;

    const mimBorrowed = Number(
      formatUnits(userBorrowAmount, config?.mimInfo.decimals)
    );

    return {
      collateralInfo: {
        userCollateralShare: userCollateralShare + collaterallInOrder.share,
        userCollateralAmount,
      },
      borrowInfo: {
        userBorrowAmount,
        userBorrowPart,
      },
      oracleRate: oracleExchangeRate,
      liquidationPrice: Number(formatUnits(liquidationPrice, 18)),
      positionHealth: positionHealth,
      collateralDeposited,
      collateralDepositedUsd,
      mimBorrowed,
      hasActiveGmOrder: collaterallInOrder.activeOrder,
    };
  });
};

const getOrdersCollateralBalance = async (
  configs: Array<CauldronConfig | undefined>,
  account: string | undefined,
  chainId: number
) => {
  if (!configs || !configs.length) return [];
  if (chainId !== ARBITRUM_CHAIN_ID || !account) {
    return configs.map(() => {
      return {
        amount: 0n,
        share: 0n,
      };
    });
  }

  const publicClient = getPublicClient(ARBITRUM_CHAIN_ID);

  const degenBoxContractInfo = degenBoxInfo.find(
    (contractInfo: ExtendedContractInfo) =>
      contractInfo.chainId === ARBITRUM_CHAIN_ID
  );

  const orders = await publicClient.multicall({
    contracts: configs.map((config: any) => {
      return {
        address: config.contract.address,
        abi: config.contract.abi,
        functionName: "orders",
        args: [account],
      };
    }),
  });

  const collaterallInOrders: any = await publicClient.multicall({
    contracts: orders.map((response: any) => {
      return {
        address: response?.error ? ZERO_ADDRESS : response?.result,
        abi: orderAbi,
        functionName: "orderValueInCollateral",
        args: [],
      };
    }),
  });

  const collaterallInShare: any = await publicClient.multicall({
    contracts: collaterallInOrders.map((response: any, index: number) => {
      const collateral = configs[index]!.collateralInfo.address;
      const amount = response?.error ? BigNumber.from(0) : response?.result;
      return {
        address: degenBoxContractInfo?.address,
        abi: degenBoxContractInfo?.abi,
        functionName: "toShare",
        args: [collateral, amount, false],
      };
    }),
  });

  return collaterallInOrders.map((response: any, index: number) => {
    return {
      amount: response?.error ? 0n : response?.result,
      share: collaterallInShare[index]?.result || 0n,
    };
  });
};
