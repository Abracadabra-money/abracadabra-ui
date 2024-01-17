import store from "@/store";

import { getStargateApy } from "@/helpers/collateralsApy/getStargateApy";
import { getLUSDApy } from "@/helpers/collateralsApy/getLUSDApy";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getVeloApy } from "@/helpers/collateralsApy/getVeloApy";
import { getCrvApy } from "@/helpers/collateralsApy/getCrvApy";
import { getYearnVaultsApy } from "@/helpers/collateralsApy/getYearnVaultsApy";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { getGMApr } from "./getGMApr";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier.ts";
// @ts-ignore
import filters from "@/filters/index.js";
const LS_APR_KEY = "abracadabraCauldronsApr";

export const isApyCalcExist = (chainId, poolId) => {
  let cauldronsIds = [];

  if (chainId === 1) {
    cauldronsIds = [6, 7, 15, 16, 24, 25, 29, 30, 31, 32, 33, 34, 37, 38, 39];
  }

  // if (chainId === 10) {
  //   cauldronsIds = [1];
  // }

  if (chainId === 42161) {
    cauldronsIds = [2, 3, 4, 5, 6, 7, 8];
  }

  return cauldronsIds.indexOf(poolId) !== -1;
};

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
    if (pool.config.id === 31 || pool.config.id === 32)
      return await getStargateApy(pool, provider);

    if (pool.config.id === 39) return await getMagicApeApy(chainId);
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

  return await getYearnVaultsApy(pool);
};

const fetchCollateralApy = async (cauldron, chainId, address) => {
  const provider = new providers.StaticJsonRpcProvider(defaultRpc[chainId]);

  const apr = await fetchTokenApy(cauldron, chainId, provider);

  const localData = localStorage.getItem(LS_APR_KEY);
  const parsedData = localData ? JSON.parse(localData) : {};

  parsedData[address] = {
    chainId,
    apr: Number(filters.formatToFixed(apr, 2)),
    createdAt: new Date().getTime(),
  };

  localStorage.setItem(LS_APR_KEY, JSON.stringify(parsedData));

  return filters.formatToFixed(apr, 2);
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

export const getCollateralApr = async (
  cauldron,
  ignoreUserPosition = false
) => {
  const { chainId, id, contract } = cauldron.config;
  const isApyExist = isApyCalcExist(chainId, id);

  if (!isApyExist) return { value: 0, multiplier: 0 };

  const localApr = localStorage.getItem(LS_APR_KEY);
  const parseLocalApr = localApr ? JSON.parse(localApr) : null;

  const isOutdated = isAprOutdate(parseLocalApr, contract.address);
  const collateralApy = !isOutdated
    ? parseLocalApr[contract.address].apr
    : await fetchCollateralApy(cauldron, chainId, contract.address);

  const multiplier = !ignoreUserPosition
    ? getMaxLeverageMultiplier(cauldron)
    : getMaxLeverageMultiplier(cauldron, 10, false, 1, true);

  return { value: collateralApy, multiplier };
};
