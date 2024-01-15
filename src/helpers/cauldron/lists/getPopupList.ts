import { Contract, providers, utils, BigNumber } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";

import cauldronsConfig from "@/utils/cauldronsConfig";
import lensAbi from "@/utils/abi/marketLens.js";

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
  const lensAddress = getLensAddress(chainId);

  // NOTICE: BERA TEST
  const multicallProvider =
    chainId === 80085 ? provider : MulticallWrapper.wrap(provider);

  const configs: any[] = cauldronsConfig.filter((config) => {
    let result = config.chainId === +chainId;

    if (config.cauldronSettings.isPrivate)
      result = config.cauldronSettings.privatelyFor!.some(
        (walletAddress) => walletAddress === account
      );

    return result;
  });

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
    multicallProvider,
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

  const collateralPrices = collateralContracts.map((_, idx): BigNumber => {
    const { decimals } = configs[idx].collateralInfo;
    return utils
      .parseUnits("1", decimals)
      .mul(Math.pow(10, decimals).toString())
      .div(oracleRates[idx]);
  });

  const collateralAmounts = await Promise.all(
    collateralContracts.map((contract) => contract.balanceOf(account))
  );

  const parseCollateralAmounts = collateralAmounts.map((amount, idx) => {
    return utils.formatUnits(amount, configs[idx].collateralInfo.decimals);
  });

  const collateralAmountsUsd = collateralAmounts.map((amount, idx) => {
    const { decimals } = configs[idx].collateralInfo;
    return utils.formatUnits(
      amount.mul(collateralPrices[idx]).div(Math.pow(10, decimals).toString()),
      decimals
    );
  });

  const { parseUnwrappedTokenAmounts, unwrappedTokenAmountsUsd } =
    await getUnwrappedTokenAmounts(
      configs,
      provider,
      account,
      collateralContracts,
      collateralPrices
    );

  return configs.map((_: any, idx: number) => {
    return {
      collateralAmount: parseCollateralAmounts[idx],
      collateralAmountUsd: collateralAmountsUsd[idx],
      unwrappedTokenAmount: parseUnwrappedTokenAmounts[idx],
      unwrappedTokenAmountUsd: unwrappedTokenAmountsUsd[idx],
    };
  });
};

const getUnwrappedTokenAmounts = async (
  configs: Array<Object | any>,
  provider: providers.BaseProvider,
  account: string,
  collateralContracts: Array<Contract | null>,
  collateralPrices: Array<BigNumber>
) => {
  const unwrappedTokenContracts = configs.map(({ wrapInfo }) => {
    if (wrapInfo) {
      const { address, abi } = wrapInfo.unwrappedToken;
      return new Contract(address, abi, provider);
    } else return null;
  });

  const unwrappedTokenAmounts = await Promise.all(
    unwrappedTokenContracts.map(
      (contract: Contract | null) => contract?.balanceOf(account) || null
    )
  );

  const parseUnwrappedTokenAmounts = unwrappedTokenAmounts.map(
    (amount, idx) => {
      return amount
        ? utils.formatUnits(amount, configs[idx].collateralInfo.decimals)
        : "0.0";
    }
  );

  const unwrappedTokenRates = await Promise.all(
    collateralContracts.map((contract: Contract | null, idx: number) =>
      Object.prototype.hasOwnProperty.call(contract, "convertToAssets")
        ? contract?.convertToAssets(
            Math.pow(10, configs[idx].collateralInfo.decimals).toString()
          )
        : null
    )
  );

  const unwrappedTokenAmountsUsd = unwrappedTokenAmounts.map((amount, idx) => {
    try {
      const { decimals } = configs[idx].collateralInfo;
      return utils.formatUnits(
        amount
          .mul(collateralPrices[idx])
          .div(Math.pow(10, decimals).toString())
          .mul(unwrappedTokenRates[idx])
          .div(Math.pow(10, decimals).toString()),
        decimals
      );
    } catch (error) {
      return "0.0";
    }
  });

  return { parseUnwrappedTokenAmounts, unwrappedTokenAmountsUsd };
};
