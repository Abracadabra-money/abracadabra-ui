import store from "@/store";

import { getStargateApy } from "@/helpers/collateralsApy/getStargateApy";
import { getLUSDApy } from "@/helpers/collateralsApy/getLUSDApy";
import { getGlpApy } from "@/helpers/collateralsApy/getGlpApy";
import { getVeloApy } from "@/helpers/collateralsApy/getVeloApy";
import { getXbooApy } from "@/helpers/collateralsApy/getXbooApy";
import { getJlpApy } from "@/helpers/collateralsApy/getJlpApy";
import { getOhmApy } from "@/helpers/collateralsApy/getOhmApy";
import { getCrvApy } from "@/helpers/collateralsApy/getCrvApy";
import { getWmemoApy } from "@/helpers/collateralsApy/getWmemoApy";
import { getXsushiApy } from "@/helpers/collateralsApy/getXsushiApy";
import { getYearnVaultsApy } from "@/helpers/collateralsApy/getYearnVaultsApy";

export const fetchTokenApy = async (pool) => {
  let chainId = store.getters.getChainId;
  let provider = store.getters.getProvider;

  if (chainId === 1) {
    if (pool.id === 10) return await getOhmApy();
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

    if (pool.id === 5 || pool.id === 8) return await getXsushiApy(); // out of date
  }

  if (chainId === 10) {
    if (pool.id === 1) return await getVeloApy(pool, provider);
  }

  if (chainId === 250) {
    if (pool.id === 5) return await getXbooApy(); // out of date
  }

  if (chainId === 42161) {
    if (pool.id === 2 || pool.id === 3) return await getGlpApy(pool.id === 3);
  }

  if (chainId === 43114) {
    if (pool.id === 2 || pool.id === 5) return await getWmemoApy(provider);

    if (pool.joeInfo) {
      return await getJlpApy(pool, provider); // out of date
    }
  }

  return await getYearnVaultsApy(pool);
};
