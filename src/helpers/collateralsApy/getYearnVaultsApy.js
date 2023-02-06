import store from "@/store";

export const getTokensVaults = async () => {
  return await store.dispatch("fetchTokenVaults");
};

export const getYearnVaultsApy = async (pool) => {
  try {
    if (store.getters.getTokensVaults.length === 0) {
      const tokensVaults = await getTokensVaults();
      store.commit("setTokensVaults", tokensVaults);
    }

    const tokenItem = store.getters.getTokensVaults.find(
      (item) => item.address === pool.collateralToken.address
    );

    if (!tokenItem) return null;

    return tokenItem.apy.net_apy * 100;
  } catch (error) {
    console.log("getYearnVaultsApy err:", error);
  }
};
