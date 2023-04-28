import { Contract, providers, utils } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import cauldronsConfig from "@/utils/cauldronsConfig";
import lensAbi from "@/utils/abi/marketLens.js";
const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";

type PopupListItem = {
  config: object;
  interest: number;
  userInfo: object | null;
};

const defaultUserBalance = {
  collateralAmount: "0.0",
  collateralAmountUsd: "0.0",
  unwrappedTokenAmount: "0.0",
  unwrappedTokenAmountUsd: "0.0",
};

export const getPopupList = async (
  chainId: number,
  provider: providers.BaseProvider,
  account: string
): Promise<PopupListItem[]> => {
  const multicalProvider = MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const lensContract = new Contract(lensAddress, lensAbi, provider);

  const interestArr = await Promise.all(
    configs.map(({ interest, contract }) =>
      interest
        ? interest * 100
        : lensContract.getInterestPerYear(contract.address)
    )
  );

  const userInfo: Array<Object> = await getUserBalances(
    account,
    configs,
    multicalProvider,
    lensContract
  );

  return configs.map((config, idx) => {
    return {
      config,
      interest: interestArr[idx] / 100,
      userInfo: userInfo ? userInfo[idx] : null,
    };
  });
};

const getUserBalances = async (
  account: string,
  configs: Array<Object | any>,
  provider: providers.BaseProvider,
  lensContract: Contract
) => {
  if (!account) return configs.map(() => defaultUserBalance);

  const collateralContracts = configs.map(
    ({ collateralInfo }) =>
      new Contract(collateralInfo.address, collateralInfo.abi, provider)
  );

  const oracleRates = await Promise.all(
    configs.map(({ contract }) =>
      lensContract.getOracleExchangeRate(contract.address)
    )
  );

  const collateralAmounts = await Promise.all(
    collateralContracts.map((contract) => contract.balanceOf(account))
  );

  const collateralsPrices = collateralContracts.map((_, idx): any => {
    return toBigNumber(1, configs[idx])
      .mul(getPrecision(configs[idx]))
      .div(oracleRates[idx]);
  });

  const collateralAmountsUsd = collateralAmounts.map((amount, idx) => {
    return amount.mul(collateralsPrices[idx]).div(getPrecision(configs[idx]));
  });

  const { unwrappedTokenAmounts, unwrappedTokenAmountsUsd } =
    await getUnwrappedTokenAmounts(
      configs,
      provider,
      account,
      collateralContracts,
      collateralsPrices
    );

  return configs.map((_: any, idx: number) => {
    const { decimals } = configs[idx].collateralInfo;
    return {
      collateralAmount: collateralAmounts[idx]
        ? utils.formatUnits(collateralAmounts[idx], decimals)
        : "0.0",
      collateralAmountUsd: collateralAmountsUsd[idx]
        ? utils.formatUnits(collateralAmountsUsd[idx], decimals)
        : "0.0",
      unwrappedTokenAmount: unwrappedTokenAmounts[idx]
        ? utils.formatUnits(unwrappedTokenAmounts[idx], decimals)
        : "0.0",
      unwrappedTokenAmountUsd: unwrappedTokenAmountsUsd[idx]
        ? utils.formatUnits(unwrappedTokenAmountsUsd[idx], decimals)
        : "0.0",
    };
  });
};

const getUnwrappedTokenAmounts = async (
  configs: Array<Object | any>,
  provider: providers.BaseProvider,
  account: string,
  collateralContracts: Array<Contract | null>,
  collateralsPrices: Array<bigint>
) => {
  const unwrappedTokenContracts = configs.map(({ wrapInfo }) => {
    if (wrapInfo) {
      const { address, abi } = wrapInfo.unwrappedToken;
      return new Contract(address, abi, provider);
    } else return null;
  });

  const unwrappedTokenAmounts = await Promise.all(
    unwrappedTokenContracts.map(
      (contract: any) => contract?.balanceOf(account) || null
    )
  );

  const unwrappedTokenRates = await Promise.all(
    collateralContracts.map((contract: any, idx: number) =>
      Object.prototype.hasOwnProperty.call(contract, "convertToAssets")
        ? contract.convertToAssets(getPrecision(configs[idx]))
        : null
    )
  );

  const unwrappedTokenAmountsUsd = unwrappedTokenAmounts.map((amount, idx) => {
    try {
      return amount
        .mul(collateralsPrices[idx])
        .div(getPrecision(configs[idx]))
        .mul(unwrappedTokenRates[idx])
        .div(getPrecision(configs[idx]));
    } catch (error) {
      return toBigNumber(0, configs[idx]);
    }
  });

  return { unwrappedTokenAmounts, unwrappedTokenAmountsUsd };
};

const getPrecision = ({ collateralInfo }: any) => {
  return Math.pow(10, collateralInfo.decimals).toString();
};

const toBigNumber = (number: number, { collateralInfo }: any) => {
  return utils.parseUnits(number.toString(), collateralInfo.decimals);
};
