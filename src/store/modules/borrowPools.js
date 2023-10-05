import axios from "axios";
export default {
  state: {
    borrowPools: [],
    isLoadingPoolsBorrow: true,
    isCreatingPoolsBorrow: false,
    tokensVaults: [],
  },
  mutations: {
    setPools(state, payload) {
      state.borrowPools = payload;
    },
    setTokensVaults(state, payload) {
      state.tokensVaults = payload;
    },
    setLoadingPoolsBorrow(state, payload) {
      state.isLoadingPoolsBorrow = payload;
    },
    setCreatingPoolsBorrow(state, payload) {
      if (!state.isCreatingPoolsBorrow) {
        state.isCreatingPoolsBorrow = payload;
      }
    },
  },

  actions: {
    async fetchTokenVaults() {
      try {
        const url = "https://api.yexporter.io/v1/chains/1/vaults/all";
        const response = await axios.get(url);
        return response.data;
      } catch (e) {
        console.log("fetchTokenVaults err: ", e);
      }
    },
  },

  getters: {
    getPools: (state) => state.borrowPools,
    getPoolById: (state) => (id) => {
      return state.borrowPools.find((pool) => pool.id === id);
    },
    getLoadPoolsBorrow: (state) => state.isLoadingPoolsBorrow,
    getCreatePoolsBorrow: (state) => state.isCreatingPoolsBorrow,
    getTokensVaults: (state) => state.tokensVaults,
  },
};
