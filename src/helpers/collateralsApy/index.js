import store from "@/store";

import { getStargateApy } from "@/helpers/collateralsApy/getStargateApy";
import { getLUSDApy } from "@/helpers/collateralsApy/getLUSDApy";
import { getGlpApy } from "@/helpers/collateralsApy/getGlpApy";
import { getVeloApy } from "@/helpers/collateralsApy/getVeloApy";
import { getCrvApy } from "@/helpers/collateralsApy/getCrvApy";
import { getYearnVaultsApy } from "@/helpers/collateralsApy/getYearnVaultsApy";

export const isApyCalcExist = (chainId, poolId) => {
  let cauldronsIds = [];

  if (chainId === 1) {
    cauldronsIds = [15, 16, 24, 25, 31, 32, 34];
  }

  if (chainId === 10) {
    cauldronsIds = [1];
  }

  if (chainId === 42161) {
    cauldronsIds = [2, 3];
  }

  return cauldronsIds.indexOf(poolId !== -1);
};

export const fetchTokenApy = async (pool) => {
  let chainId = store.getters.getChainId;
  let provider = store.getters.getProvider;

  if (chainId === 1) {
    if (pool.id === 34) return await getLUSDApy(provider);
    if (pool.id === 15 || pool.id === 24 || pool.id === 25)
      return await getCrvApy(
        pool,
        "0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8",
        provider
      );
    if (pool.id === 16)
      return await getCrvApy(
        pool,
        "0x9d5c5e364d81dab193b72db9e9be9d8ee669b652",
        provider
      );
    if (pool.id === 31 || pool.id === 32)
      return await getStargateApy(pool, provider);
  }

  if (chainId === 10) {
    if (pool.id === 1) return await getVeloApy(pool, provider);
  }

  if (chainId === 42161) {
    if (pool.id === 2 || pool.id === 3) return await getGlpApy(pool.id === 3);
  }

  return await getYearnVaultsApy(pool);
};
