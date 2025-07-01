import store from "@/store";
import { APR_KEY } from "@/constants/global";
import { formatToFixed } from "@/helpers/filters";
import { getGMApr } from "@//helpers/collateralsApy/getGMApr";
import { getCrvApy } from "@/helpers/collateralsApy/getCrvApy";
import { getVeloApy } from "@/helpers/collateralsApy/getVeloApy";
import { getLUSDApy } from "@/helpers/collateralsApy/getLUSDApy";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import { getElixirApy } from "@/helpers/collateralsApy/getElixirApy";
import { getUsd0ppApy } from "@/helpers/collateralsApy/getUsd0ppApy";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier";
import { getMaxLeverageMultiplierPayload } from "@/helpers/migrationHelpers/payloadHelpers";

//NOTICE: check comments below
// import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
// import { getStargateApy } from "@/helpers/collateralsApy/getStargateApy";
// import { getYearnVaultsApy } from "@/helpers/collateralsApy/getYearnVaultsApy";

export const fetchTokenApy = async (pool, chainId, provider) => {
  if (!chainId || !provider) {
    chainId = store.getters.getChainId;
    provider = store.getters.getProvider;
  }

  if (chainId === 1) {
    if (pool.config.id === 34) return await getLUSDApy(provider);
    if (pool.config.id === 15 || pool.config.id === 24 || pool.config.id === 25)
      return await getCrvApy(
        pool,
        "0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8",
        provider
      );
    if (pool.config.id === 16)
      return await getCrvApy(
        pool,
        "0x9d5c5e364d81dab193b72db9e9be9d8ee669b652",
        provider
      );
    //doubleCheck distribution ended
    // if (pool.config.id === 39) return await getMagicApeApy(chainId);

    if (pool.config.id === 43 || pool.config.id === 44) return getElixirApy();

    if (pool.config.id === 45) return getUsd0ppApy();
  }

  if (chainId === 10) {
    if (pool.config.id === 1) return await getVeloApy(pool, provider);
  }

  if (chainId === 42161) {
    if (pool.config.id === 2 || pool.config.id === 3) {
      const response = await getMagicGlpApy(chainId);
      if (pool.config.id === 2) return response.glpApy;
      if (pool.config.id === 3) return response.magicGlpApy;
    }

    if (pool.config.cauldronSettings.isGMXMarket) {
      const market = pool.config.collateralInfo.address.toLowerCase();
      return await getGMApr(market, provider);
    }
  }
  // NOTICE: Stargate returns 0, and Yearn throws an error due to api. Consider if theese are still relevant
  // if (pool.config.id === 31 || pool.config.id === 32)
  //   return await getStargateApy(pool, provider);

  // return await getYearnVaultsApy(pool);
};

const fetchCollateralApy = async (cauldron, chainId, address) => {
  const provider = getEthersProvider(chainId);

  const apr = await fetchTokenApy(cauldron, chainId, provider);

  try {
    const localData = localStorage.getItem(APR_KEY);
    const parsedData = localData ? JSON.parse(localData) : {};

    parsedData.aprs ||= {};

    parsedData.aprs[address.toLowerCase()] = {
      chainId,
      apr: Number(formatToFixed(apr, 2)),
      createdAt: new Date().getTime(),
    };

    localStorage.setItem(APR_KEY, JSON.stringify(parsedData));
  } catch (error) {
    console.log("[fetchCollateralApy] save to localStorage error:", error);
  }

  return formatToFixed(apr, 2);
};

const isAprOutdate = (localData, address) => {
  if (!localData) return true;
  if (!localData[address]) return true;

  const allowedTime = 5;
  const { createdAt } = localData[address];
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - createdAt;
  const minutes = Math.floor(timeDiff / 1000 / 60);
  return minutes > allowedTime;
};

export const getCollateralApr = async (cauldron) => {
  const { chainId, contract } = cauldron.config;
  const { isAprExist } = cauldron.config.cauldronSettings;
  if (!isAprExist) return { value: 0, multiplier: 0 };

  const localApr = localStorage.getItem(APR_KEY);
  const parseLocalApr = localApr ? JSON.parse(localApr) : null;

  const isOutdated = isAprOutdate(parseLocalApr, contract.address);

  const collateralApy =
    !isOutdated && localApr
      ? parseLocalApr.aprs[contract.address.toLowerCase()].apr
      : await fetchCollateralApy(cauldron, chainId, contract.address);

  const payload = getMaxLeverageMultiplierPayload(cauldron);

  const multiplier = getMaxLeverageMultiplier(
    payload.oracleExchangeRate,
    payload.mcr,
    payload.collateralDecimals,
    payload.userBorrowAmount,
    payload.userCollateralAmount
  );

  return { value: collateralApy, multiplier };
};
