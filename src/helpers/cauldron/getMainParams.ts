import { BigNumber } from "ethers";
import { type Address, type ReadContractErrorType, type PublicClient, erc4626Abi } from "viem";
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
  const publicClient = getPublicClient(chainId);

  const marketInfos = await (publicClient.multicall({
    contracts: configs.map((config) => {
      const methodName =
        config.version === 2
          ? `getMarketInfoCauldronV2${config.cauldronSettings.oracleInfo?.kind === "PYTH" ? "Pyth" : ""}`
          : `getMarketInfoCauldronV3${config.cauldronSettings.oracleInfo?.kind === "PYTH" ? "Pyth" : ""}`;

      return {
        address: lensAddress,
        abi: lensAbi,
        functionName: methodName,
        args: [config.contract.address],
      };
    }),
  }) as Promise<Array<{ result: Omit<MarketInfo | PythMarketInfo, "kind"> }>>).then((responses) =>
    responses.map(({ result }, index) => ({
      kind: configs[index].cauldronSettings.oracleInfo?.kind === "PYTH" ? "PYTH" : "REGULAR",
      ...result,
    }) as MarketInfo | PythMarketInfo)
  );

  const contractExchangeRate: bigint | null = cauldron
    ? await publicClient.readContract({
      ...cauldron,
      functionName: "exchangeRate",
    }).catch((error: ReadContractErrorType) => {
      // Pyth cauldrons will likely revert and throw
      // catch this as it's expected
      if (error.cause.name !== "ContractFunctionRevertedError") {
        throw error;
      }
      return null;
    })
    : null;

  return Promise.all(marketInfos.map(async (marketInfo, index: number) => {
    const localInterest: number | undefined = configs[index].interest;

    const updatePrice = marketInfo.kind === "PYTH"
      ? false
      : (
        contractExchangeRate
          ? !BigNumber.from(contractExchangeRate).eq(marketInfo.oracleExchangeRate)
          : false
      );

    let oracleExchangeRate;
    let collateralPrice;
    let tvl;
    switch (marketInfo.kind) {
      case "REGULAR":
        oracleExchangeRate = marketInfo.oracleExchangeRate;
        collateralPrice = marketInfo.collateralPrice;
        tvl = marketInfo.totalCollateral.value;
        break;
      case "PYTH": {
        const config = configs[index];
        const feedData = await getPythFeedData([configs[index].cauldronSettings.oracleInfo!.feedId]);
        oracleExchangeRate = feedData.parsed[0].price.price;
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
            break;
          }
        }
        collateralPrice = 10n ** (2n * BigInt(config.collateralInfo.decimals)) / oracleExchangeRate;
        tvl = (marketInfo.totalCollateral.amount * 10n ** 18n) / oracleExchangeRate;
        break;
      }
    }

    const interest = localInterest
      ? localInterest
      : Number(marketInfo.interestPerYear) / 100;

    return {
      borrowFee: Number(marketInfo.borrowFee) / 100,
      interest,
      liquidationFee: Number(marketInfo.liquidationFee) / 100,
      collateralPrice: BigNumber.from(collateralPrice),
      mimLeftToBorrow: BigNumber.from(marketInfo.marketMaxBorrow),
      maximumCollateralRatio: BigNumber.from(marketInfo.maximumCollateralRatio),
      oracleExchangeRate: BigNumber.from(oracleExchangeRate),
      totalBorrowed: BigNumber.from(marketInfo.totalBorrowed),
      tvl: BigNumber.from(tvl),
      userMaxBorrow: BigNumber.from(marketInfo.userMaxBorrow),
      updatePrice,
      alternativeData: {
        collateralPrice,
        mimLeftToBorrow: marketInfo.marketMaxBorrow,
        maximumCollateralRatio: marketInfo.maximumCollateralRatio,
        oracleExchangeRate,
        totalBorrowed: marketInfo.totalBorrowed,
        tvl,
        userMaxBorrow: marketInfo.userMaxBorrow,
      },
    };
  }));
};
