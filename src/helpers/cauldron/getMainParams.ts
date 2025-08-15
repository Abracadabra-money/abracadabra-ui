import { BigNumber } from "ethers";
import type { Address, PublicClient } from "viem";
import lensAbi from "@/abis/marketLens.js";
import type { MainParams } from "@/helpers/cauldron/types";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { compact } from "lodash";

export interface MarketInfoResponse {
  result: {
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
  };
  status: string;
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

  const stateOverride = compact(
    configs.map(({ stateOverrides }) => stateOverrides)
  ).flat();
  const marketInfo: MarketInfoResponse[] = await publicClient.multicall({
    contracts: configs.map((config: any) => {
      const methodName =
        config.version === 2
          ? "getMarketInfoCauldronV2"
          : "getMarketInfoCauldronV3";

      return {
        address: lensAddress,
        abi: lensAbi,
        functionName: methodName,
        args: [config.contract.address],
      };
    }),
    stateOverride,
  });
  if (chainId === 42161) {
    console.log(stateOverride);
    console.log(marketInfo);
  }

  const contractExchangeRate: bigint | null = cauldron
    ? await publicClient.readContract({
        ...cauldron,
        functionName: "exchangeRate",
        stateOverride,
      })
    : null;

  return marketInfo.map(({ result }: MarketInfoResponse, index: number) => {
    const localInterest: number | undefined = configs[index].interest;

    const updatePrice = contractExchangeRate
      ? !BigNumber.from(contractExchangeRate).eq(result.oracleExchangeRate)
      : false;

    const interest = localInterest
      ? localInterest
      : Number(result.interestPerYear) / 100;

    const totalBorrowed =
      configs[index].id === 3 && configs[index].chainId === 42161
        ? 0n
        : result.totalBorrowed;

    return {
      borrowFee: Number(result.borrowFee) / 100,
      interest,
      liquidationFee: Number(result.liquidationFee) / 100,
      collateralPrice: result.collateralPrice,
      mimLeftToBorrow: result.marketMaxBorrow,
      maximumCollateralRatio: result.maximumCollateralRatio, // NOTICE nod used except test files
      oracleExchangeRate: result.oracleExchangeRate,
      totalBorrowed,
      tvl: result.totalCollateral.value,
      userMaxBorrow: result.userMaxBorrow,
      updatePrice,
    };
  });
};
