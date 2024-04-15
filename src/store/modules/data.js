export default {
  state: {
    cauldronsList: [],
    userPositions: [],
    farmList: [],
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList = payload;
    },
    setUserPositions(state, payload) {
      state.userPositions = payload;
    },
    setFarmList(state, payload) {
      state.farmList = payload;
    },
  },

  getters: {
    getCauldronsList: (state) => state.cauldronsList,
    getUserPositions: (state) => state.userPositions,
    getFarmList: (state) => state.farmList,
  },
};
