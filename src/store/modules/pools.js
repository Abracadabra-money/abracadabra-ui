export default {
  state: {
    borrowPools: [],
    // farmPools: [],
    // mim3Pool: null,
    isLoadingPoolsBorrow: null,
    // isLoadingPoolsFarm: null,
    tokensVaults: [],
  },
  mutations: {
    setPools(state, payload) {
      state.borrowPools = payload;
    },
    setTokensVaults(state, payload) {
      state.tokensVaults = payload;
    },
    // setFarmPools(state, payload) {
    //   state.farmPools = payload;
    // },
    // setMim3Pool(state, payload) {
    //   state.mim3Pool = payload;
    // },
    setLoadingPoolsBorrow(state, payload) {
      state.isLoadingPoolsBorrow = payload;
    },
    // setLoadingPoolsFarm(state, payload) {
    //   state.isLoadingPoolsFarm = payload;
    // },
  },

  getters: {
    getPools: (state) => state.borrowPools,
    getPoolById: (state) => (id) => {
      return state.borrowPools.find((pool) => pool.id === id);
    },
    // getFarmPools: (state) => state.farmPools,
    // getFarmPoolById: (state) => (id) => {
    //   return state.farmPools.find((pool) => pool.id === id);
    // },
    // getMim3Pools: (state) => state.mim3Pool,
    getLoadPoolsBorrow: (state) => state.isLoadingPoolsBorrow,
    // getLoadPoolsFarm: (state) => state.isLoadingPoolsFarm,
    getTokensVaults: (state) => state.tokensVaults,
  },
};
