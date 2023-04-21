import { Contract, providers, BigNumber } from "ethers";

import cauldronsConfig from "@/utils/cauldronsConfig";
import bentoBoxAbi from "@/utils/abi/bentoBox";

import { getInterest } from "@/helpers/cauldron/interest";
import { getMIMsLeftToBorrow } from "@/helpers/cauldron/borrowLimits";
import { getTotalBorrow } from "@/helpers/cauldron/totalBorrow";
import { getCauldronOracleRates } from "@/helpers/cauldron/exchangeRates";

type CauldronListItem = {
  config: object,
  interest: string,
  tvl: string,
  totalBorrowed: string,
  MIMsLeftToBorrow: string,
}

export const initCauldronsList = async (chainId: number, provider: providers.Provider): Promise<CauldronListItem[]> => {
  const filteredByChain: object[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const cauldrons: CauldronListItem[] = await Promise.all(
    filteredByChain.map((cauldron) => createCauldronItem(cauldron, provider))
  );

  console.log("cauldrons", cauldrons);

  return cauldrons;
}

export const createCauldronItem = async (config: any, provider: providers.Provider): Promise<CauldronListItem> => {
  const cauldron = new Contract(
    config.contract.address,
    config.contract.abi,
    provider
  );

  const interest: string = config.interest ? config.interest : await getInterest(cauldron);

  const bentoBoxAddress = await cauldron.bentoBox();

  const bentoBox = new Contract(
    bentoBoxAddress,
    bentoBoxAbi,
    provider
  );

  const totalCollateralShare: BigNumber = await cauldron.totalCollateralShare();
  const totalCollateralAmount: BigNumber = await bentoBox.toAmount(
    config.collateralInfo.address,
    totalCollateralShare,
    false
  );

  const { oracleRate } = await getCauldronOracleRates(
    cauldron,
    provider
  );

  const tvl = totalCollateralAmount.div(oracleRate).toString();

  const totalBorrowed = await getTotalBorrow(
    cauldron
  );

  const MIMsLeftToBorrow = await getMIMsLeftToBorrow(
    cauldron,
    bentoBox,
    config.mimInfo.address,
    totalBorrowed,
    config.cauldronSettings
  );

  return {
    config,
    interest: interest,
    tvl: tvl,
    totalBorrowed,
    MIMsLeftToBorrow: MIMsLeftToBorrow.toString(),
  };
}
