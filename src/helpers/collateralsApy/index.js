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

const mainnetId = 1;

export const fetchTokenApy = async (pool) => {
  let chainId = store.getters.getChainId;
  let signer = store.getters.getSigner;

  if (pool.id === 34 && chainId === 1) {
    return await getLUSDApy(signer);
  }

  if (pool.id === 5 && chainId === 250) {
    return await getXbooApy(); // out of date
  }

  if (pool.joeInfo) {
    return await getJlpApy(pool, signer);
  }

  if (pool.id === 10 && chainId === mainnetId) {
    return await getOhmApy();
  }

  if (
    (pool.id === 15 || pool.id === 24 || pool.id === 25) &&
    chainId === mainnetId
  ) {
    return await getCrvApy(
      pool,
      "0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8",
      signer
    );
  }

  if (pool.id === 16 && chainId === mainnetId) {
    return await getCrvApy(
      pool,
      "0x9d5c5e364d81dab193b72db9e9be9d8ee669b652",
      signer
    );
  }

  if ((pool.id === 31 || pool.id === 32) && chainId === mainnetId) {
    return await getStargateApy(pool, signer);
  }

  if ((pool.id === 2 || pool.id === 5) && chainId === 43114) {
    return await getWmemoApy(signer);
  }

  if ((pool.id === 2 || pool.id === 3) && chainId === 42161) {
    return await getGlpApy(pool.id === 3);
  }

  if (pool.id === 1 && chainId === 10) {
    return await getVeloApy(pool, signer);
  }

  if ((pool.id === 5 || pool.id === 8) && chainId === mainnetId) {
    return await getXsushiApy(); // out of date
  }

  return await getYearnVaultsApy(pool);
};
