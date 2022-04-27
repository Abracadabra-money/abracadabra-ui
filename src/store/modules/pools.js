export default {
  state: {
    borrowPools: [],
    // farmPools: [],
    // mim3Pool: null,
    isLoadingPoolsBorrow: null,
    isCreatingPoolsBorrow: false,
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
    setCreatingPoolsBorrow(state, payload) {
      if (!state.isCreatingPoolsBorrow) {
        state.isCreatingPoolsBorrow = payload;
      }
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
    getCreatePoolsBorrow: (state) => state.isCreatingPoolsBorrow,
    // getLoadPoolsFarm: (state) => state.isLoadingPoolsFarm,
    getTokensVaults: (state) => state.tokensVaults,
  },
};
