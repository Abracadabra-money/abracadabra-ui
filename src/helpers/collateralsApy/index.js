import store from "@/store";

import { getStargateApy } from "@/helpers/collateralsApy/getStargateApy";
import { getLUSDApy } from "@/helpers/collateralsApy/getLUSDApy";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getVeloApy } from "@/helpers/collateralsApy/getVeloApy";
import { getCrvApy } from "@/helpers/collateralsApy/getCrvApy";
import { getYearnVaultsApy } from "@/helpers/collateralsApy/getYearnVaultsApy";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { getGMApr } from "./getGMApr";

export const isApyCalcExist = (chainId, poolId) => {
  let cauldronsIds = [];

  if (chainId === 1) {
    cauldronsIds = [6, 7, 15, 16, 24, 25, 29, 30, 31, 32, 33, 34, 37, 38, 39];
  }

  if (chainId === 10) {
    cauldronsIds = [1];
  }

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

    if (pool.config.id === 39) return await getMagicApeApy(provider);
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
