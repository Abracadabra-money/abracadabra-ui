import { BigNumber } from "ethers";
import { type Address, type PublicClient, erc4626Abi } from "viem";
import lensAbi from "@/abis/marketLens";
import type { MainParams } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { getPythFeedData } from "../pyth";

interface MarketInfo {
  kind: "REGULAR",
  borrowFee: bigint;
  cauldron: Address;
  collateralPrice: bigint;
  interestPerYear: bigint;
  liquidationFee: bigint;
  marketMaxBorrow: bigint;
  maximumCollateralRatio: bigint;
  oracleExchangeRate: bigint;
  totalBorrowed: bigint;
  totalCollateral: {
    amount: bigint;
    value: bigint;
  };
  userMaxBorrow: bigint;
}

interface PythMarketInfo {
  kind: "PYTH",
  borrowFee: bigint;
  cauldron: Address;
  interestPerYear: bigint;
  liquidationFee: bigint;
  marketMaxBorrow: bigint;
  maximumCollateralRatio: bigint;
  totalBorrowed: bigint;
  totalCollateral: {
    amount: bigint;
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

  const [contractExchangeRate, ...marketInfos] = await Promise.all([
    cauldron
      ? await (publicClient as any).readContract({
        ...cauldron,
        functionName: "exchangeRate",
      }) as Promise<bigint> : undefined,
    await publicClient.multicall({
      contracts: configs.map((config) => {
        const methodName =
          config.version === 2
            ? `getMarketInfoCauldronV2${config.cauldronSettings.oracleInfo?.kind === "PYTH" ? "Pyth" : ""}` as const
            : `getMarketInfoCauldronV3${config.cauldronSettings.oracleInfo?.kind === "PYTH" ? "Pyth" : ""}` as const;

        return {
          address: lensAddress,
          abi: lensAbi,
          functionName: methodName,
          args: [config.contract.address],
        } as const;
      }),
      allowFailure: false,
    })
  ]);

  return Promise.all(marketInfos.map(async (marketInfo, index: number) => {
    const config = configs[index];
    switch (config.cauldronSettings.oracleInfo?.kind) {
      case "PYTH":
        return await getPythMainParams(publicClient, config, marketInfo as any as PythMarketInfo);
      case undefined:
        return getRegularMainParams(config, marketInfo as any as MarketInfo, contractExchangeRate);
    }
  }));
};

const getRegularMainParams = (config: CauldronConfig, marketInfo: MarketInfo, contractExchangeRate?: bigint): MainParams => {
  // Note: Never needed for Cauldron V3+ and never needed
  // for the user if the update decreases the collateralPrice
  // Could be:
  // const updatePrice = config.version < 3 && contractExchangeRate !== undefined
  //   ? marketInfo.oracleExchangeRate < contractExchangeRate
  //   : false;
  const updatePrice = contractExchangeRate !== undefined
    ? contractExchangeRate !== marketInfo.oracleExchangeRate
    : false;
  return {
    borrowFee: Number(marketInfo.borrowFee) / 100,
    interest: config.interest ?? Number(marketInfo.interestPerYear) / 100,
    liquidationFee: Number(marketInfo.liquidationFee) / 100,
    collateralPrice: BigNumber.from(marketInfo.collateralPrice),
    mimLeftToBorrow: BigNumber.from(marketInfo.marketMaxBorrow),
    maximumCollateralRatio: BigNumber.from(marketInfo.maximumCollateralRatio),
    oracleExchangeRate: BigNumber.from(marketInfo.oracleExchangeRate),
    totalBorrowed: BigNumber.from(marketInfo.totalBorrowed),
    tvl: BigNumber.from(marketInfo.totalCollateral.value),
    userMaxBorrow: BigNumber.from(marketInfo.userMaxBorrow),
    updatePrice,
    alternativeData: {
      collateralPrice: marketInfo.collateralPrice,
      mimLeftToBorrow: marketInfo.marketMaxBorrow,
      maximumCollateralRatio: marketInfo.maximumCollateralRatio,
      oracleExchangeRate: marketInfo.oracleExchangeRate,
      totalBorrowed: marketInfo.totalBorrowed,
      tvl: marketInfo.totalCollateral.value,
      userMaxBorrow: marketInfo.userMaxBorrow,
    },
  };
};

const getPythMainParams = async (publicClient: PublicClient, config: CauldronConfig, marketInfo: PythMarketInfo): Promise<MainParams> => {
  const feedData = await getPythFeedData([config.cauldronSettings.oracleInfo!.feedId]);
  let oracleExchangeRate = feedData.parsed[0].price.price;
  const wrapper = config.cauldronSettings.oracleInfo!.wrapper;
  switch (wrapper?.kind) {
    case "INVERSE":
      oracleExchangeRate = wrapper.decimalScale / oracleExchangeRate;
      break;
    case "ERC4626": {
      const assets = await (publicClient as PublicClient).readContract({
        abi: erc4626Abi,
        address: wrapper.vault,
        functionName: "convertToAssets",
        args: [oracleExchangeRate],
      });
      oracleExchangeRate = wrapper.decimalScale / assets;
    }
  }
  const collateralPrice = 10n ** (2n * BigInt(config.collateralInfo.decimals)) / oracleExchangeRate;
  const tvl = (marketInfo.totalCollateral.amount * 10n ** 18n) / oracleExchangeRate;

  return {
    borrowFee: Number(marketInfo.borrowFee) / 100,
    interest: config.interest ?? Number(marketInfo.interestPerYear) / 100,
    liquidationFee: Number(marketInfo.liquidationFee) / 100,
    collateralPrice: BigNumber.from(collateralPrice),
    mimLeftToBorrow: BigNumber.from(marketInfo.marketMaxBorrow),
    maximumCollateralRatio: BigNumber.from(marketInfo.maximumCollateralRatio),
    oracleExchangeRate: BigNumber.from(oracleExchangeRate),
    totalBorrowed: BigNumber.from(marketInfo.totalBorrowed),
    tvl: BigNumber.from(tvl),
    userMaxBorrow: BigNumber.from(marketInfo.userMaxBorrow),
    updatePrice: false,
    alternativeData: {
      collateralPrice,
      mimLeftToBorrow: marketInfo.marketMaxBorrow,
      maximumCollateralRatio: marketInfo.maximumCollateralRatio,
      oracleExchangeRate,
      totalBorrowed: marketInfo.totalBorrowed,
      tvl,
      userMaxBorrow: marketInfo.userMaxBorrow,
    },
  }
}
