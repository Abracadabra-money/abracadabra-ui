import { BigNumber } from "ethers";
import type { Address, PublicClient, StateOverride } from "viem";
import lensAbi from "@/abis/marketLens";
import type { MainParams } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { getPythFeedStateOverride } from "./getPythFeedStateOverride";

interface MarketInfo {
  borrowFee: bigint;
  cauldron: Address;
  collateralPrice: bigint;
  interestPerYear: bigint;
  liquidationFee: bigint;
  marketMaxBorrow: bigint;
  maximumCollateralRatio: bigint;
  oracleExchangeRate: bigint;
  totalBorrow: {
    amount: bigint;
    part: bigint;
  };
  totalCollateral: {
    amount: bigint;
    value: bigint;
  };
  userMaxBorrow: bigint;
}

interface CauldronContractConfig {
  name: string;
  address: string;
  abi: any;
}

export const getMainParams = async (
  configs: Array<CauldronConfig>,
  chainId: number,
  cauldron?: CauldronContractConfig | undefined
): Promise<Array<MainParams>> => {
  const lensAddress = getLensAddress(chainId);
  const publicClient: PublicClient = getPublicClient(chainId);

  const stateOverride: StateOverride = [];

  const pythFeedIds = [...new Set(configs.flatMap((config) =>
    config.cauldronSettings.oracleInfo?.kind === "PYTH"
      ? config.cauldronSettings.oracleInfo.feedIds
      : []
  ))];
  if (pythFeedIds.length > 0) {
    // Override the state with the Pyth feed data to get the latest price and avoid reverts
    stateOverride.push(await getPythFeedStateOverride(chainId, pythFeedIds))
  }
  const [contractExchangeRate, marketInfos] = await Promise.all([
    cauldron
      ? await (publicClient as any).readContract({
        ...cauldron,
        functionName: "exchangeRate",
      }) as Promise<bigint> : undefined,
    await publicClient.multicall({
      contracts: configs.map((config) => {
        const methodName =
          config.version === 2
            ? `getMarketInfoCauldronV2` as const
            : `getMarketInfoCauldronV3` as const;
        return {
          address: lensAddress,
          abi: lensAbi,
          functionName: methodName,
          args: [config.contract.address],
        } as const;
      }),
      stateOverride,
      allowFailure: false,
    })
  ]);

  return Promise.all(marketInfos.map(async (marketInfo, index) => {
    const config = configs[index];
    return getMarketMainParams(config, marketInfo, contractExchangeRate);
  }));
};

const getMarketMainParams = (config: CauldronConfig, marketInfo: MarketInfo, contractExchangeRate?: bigint): MainParams => {
  const updatePrice = config.version < 3 && contractExchangeRate !== undefined
    ? marketInfo.oracleExchangeRate < contractExchangeRate
    : false;
  return {
    borrowFee: Number(marketInfo.borrowFee) / 100,
    interest: config.interest ?? Number(marketInfo.interestPerYear) / 100,
    liquidationFee: Number(marketInfo.liquidationFee) / 100,
    collateralPrice: BigNumber.from(marketInfo.collateralPrice),
    mimLeftToBorrow: BigNumber.from(marketInfo.marketMaxBorrow),
    maximumCollateralRatio: BigNumber.from(marketInfo.maximumCollateralRatio),
    oracleExchangeRate: BigNumber.from(marketInfo.oracleExchangeRate),
    totalBorrowed: BigNumber.from(marketInfo.totalBorrow.amount),
    tvl: BigNumber.from(marketInfo.totalCollateral.value),
    userMaxBorrow: BigNumber.from(marketInfo.userMaxBorrow),
    updatePrice,
    alternativeData: {
      collateralPrice: marketInfo.collateralPrice,
      mimLeftToBorrow: marketInfo.marketMaxBorrow,
      maximumCollateralRatio: marketInfo.maximumCollateralRatio,
      oracleExchangeRate: marketInfo.oracleExchangeRate,
      totalBorrowed: marketInfo.totalBorrow.amount,
      tvl: marketInfo.totalCollateral.value,
      userMaxBorrow: marketInfo.userMaxBorrow,
    },
  };
};
