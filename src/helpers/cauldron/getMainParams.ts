import { BigNumber } from "ethers";
import { type Address, type PublicClient, keccak256, encodeAbiParameters, parseAbiParameters, pad, encodePacked, type StateOverride } from "viem";
import lensAbi from "@/abis/marketLens";
import type { MainParams } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { getPythFeedData } from "../pyth";
import { getPythAddress } from "./getPythAddress";
import { getPythPriceSlot } from "./getPythPriceSlot";

interface MarketInfo {
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
    const pythAddress = getPythAddress(chainId);
    const pythPriceSlot = getPythPriceSlot(chainId);
    const pythData = await getPythFeedData(pythFeedIds);
    stateOverride.push({
      address: pythAddress,
      stateDiff: pythData.parsed.map(({ id, price }) => ({
        slot: keccak256(encodeAbiParameters(parseAbiParameters('bytes32, uint256'), [id, pythPriceSlot])),
        value: pad(encodePacked(['uint64', 'int64', 'int32', 'uint64'], [price.conf, price.price, price.expo, BigInt(price.publish_time)])),
      }))
    });
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
    return getRegularMainParams(config, marketInfo as any as MarketInfo, contractExchangeRate);
    // switch (config.cauldronSettings.oracleInfo?.kind) {
    //   case "PYTH":
    //     return await getPythMainParams(publicClient, config, marketInfo as any as PythMarketInfo);
    //   case undefined:
    //     return getRegularMainParams(config, marketInfo as any as MarketInfo, contractExchangeRate);
    // }
  }));
};

const getRegularMainParams = (config: CauldronConfig, marketInfo: MarketInfo, contractExchangeRate?: bigint): MainParams => {
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

// const getPythMainParams = async (publicClient: PublicClient, config: CauldronConfig, marketInfo: PythMarketInfo): Promise<MainParams> => {
//   const lensAddress = getLensAddress(config.chainId);
//   const oracleInfo = config.cauldronSettings.oracleInfo!;
//   const pythData = await getPythFeedData(oracleInfo.feeds.map(({ id }) => id));
//   const oracleExchangeRate = (publicClient as PublicClient).readContract({
//     address: lensAddress,
//     abi: lensAbi,
//     functionName: "getOracleExchangeRate",
//     args: [config.contract.address],

//     stateOverride: [{
//       address: oracleInfo.address,
//       state: oracleInfo.feeds.map(({ slot }) => ({
//         slot,
//         value: "0x"
//       }))
//     }],
//   });
//   // const wrapper = config.cauldronSettings.oracleInfo!.wrapper;
//   // switch (wrapper?.kind) {
//   //   case "INVERSE":
//   //     oracleExchangeRate = wrapper.decimalScale / oracleExchangeRate;
//   //     break;
//   //   case "ERC4626": {
//   //     const assets = await (publicClient as PublicClient).readContract({
//   //       abi: erc4626Abi,
//   //       address: wrapper.vault,
//   //       functionName: "convertToAssets",
//   //       args: [oracleExchangeRate],
//   //     });
//   //     oracleExchangeRate = wrapper.decimalScale / assets;
//   //   }
//   // }
//   const collateralPrice = 10n ** (2n * BigInt(config.collateralInfo.decimals)) / oracleExchangeRate;
//   const tvl = (marketInfo.totalCollateral.amount * 10n ** 18n) / oracleExchangeRate;

//   return {
//     borrowFee: Number(marketInfo.borrowFee) / 100,
//     interest: config.interest ?? Number(marketInfo.interestPerYear) / 100,
//     liquidationFee: Number(marketInfo.liquidationFee) / 100,
//     collateralPrice: BigNumber.from(collateralPrice),
//     mimLeftToBorrow: BigNumber.from(marketInfo.marketMaxBorrow),
//     maximumCollateralRatio: BigNumber.from(marketInfo.maximumCollateralRatio),
//     oracleExchangeRate: BigNumber.from(oracleExchangeRate),
//     totalBorrowed: BigNumber.from(marketInfo.totalBorrowed),
//     tvl: BigNumber.from(tvl),
//     userMaxBorrow: BigNumber.from(marketInfo.userMaxBorrow),
//     updatePrice: false,
//     alternativeData: {
//       collateralPrice,
//       mimLeftToBorrow: marketInfo.marketMaxBorrow,
//       maximumCollateralRatio: marketInfo.maximumCollateralRatio,
//       oracleExchangeRate,
//       totalBorrowed: marketInfo.totalBorrowed,
//       tvl,
//       userMaxBorrow: marketInfo.userMaxBorrow,
//     },
//   }
// }
