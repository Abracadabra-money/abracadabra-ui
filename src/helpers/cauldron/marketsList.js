import { Contract } from "ethers";
import { MulticallWrapper } from "ethers-multicall-provider";
import cauldronsConfig from "@/utils/borrowPools/pools.js";

const lensAddress = "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528";
import lensAbi from "@/utils/abi/marketLens.js";

export const createMarketsList = async (chainId, provider, account) => {
  const configs = cauldronsConfig.filter(
    (config) => config.contractChain === chainId
  );

  const multicalProvider = MulticallWrapper.wrap(provider);

  const lensContract = new Contract(lensAddress, lensAbi, multicalProvider);

  console.log("lensContract", lensContract);

  const cauldronContracts = configs.map((config) => {
    return new Contract(
      config.contract.address,
      config.contract.abi,
      multicalProvider
    );
  });

  const collateralContracts = configs.map((config) => {
    return new Contract(
      config.token.address,
      config.token.abi,
      multicalProvider
    );
  });

  const lpContracts = configs.map((config) => {
    if (config?.lpLogic) {
      return new Contract(
        config.lpLogic.lpAddress,
        config.lpLogic.lpAbi,
        multicalProvider
      );
    }
  });

  const userCollateralAmounts = await Promise.all(
    collateralContracts.map((collateral) => collateral.balanceOf(account))
  );

  const userLpAmounts = await Promise.all(
    lpContracts.map((contract) => {
      if (contract?.balanceOf) return contract.balanceOf(account);
    })
  );

  const accrueInfoArr = await Promise.all(
    cauldronContracts.map((cauldron) => cauldron.accrueInfo())
  );

  const oracleRates = await Promise.all(
    configs.map((config) =>
      lensContract.getOracleExchangeRate(config.contract.address)
    )
  );

  console.log("oracleRates", oracleRates);

  // let balanceUsd =
  // this.$ethers.utils.formatUnits(
  //   userBalance,
  //   pool.collateralToken.decimals
  // ) / pool.borrowToken.exchangeRate;

  return configs.map((config, idx) => {
    return {
      config,
      interest: getInterest(accrueInfoArr[idx], config),
      userCollateralAmounts: userCollateralAmounts[idx],
      userLpAmounts: userLpAmounts[idx] || null,
    };
  });
};

const getInterest = (accrueInfo, config) => {
  if (accrueInfo.length) {
    const interesPerSecond = accrueInfo.INTEREST_PER_SECOND;
    if (!interesPerSecond) return config.interest;

    const seconds = 316880878;
    return +parseFloat(interesPerSecond / seconds).toFixed(2);
  }

  return null;
};
