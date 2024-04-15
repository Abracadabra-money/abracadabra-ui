export default {
  state: {
    cauldronsList: {
      isCreated: false,
      data: [],
    },
    userPositions: [],
    farmList: [],
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList.isCreated = true;
      state.cauldronsList.data = payload;
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
