export default {
  state: {
    farmPools: [],
    isLoadingPoolsFarm: true,
  },
  mutations: {
    setFarmPools(state, payload) {
      console.log(payload);
      state.farmPools = payload;
    },
    setLoadingPoolsFarm(state, payload) {
      state.isLoadingPoolsFarm = payload;
    },
  },
  getters: {
    getFarmPools: (state) => state.farmPools,
    getFarmPoolById: (state) => (id) => {
      return state.farmPools.find((pool) => pool.id === id);
    },
    getFarmPoolLoading: (state) => {
      return state.isLoadingPoolsFarm;
    },
  },
};
