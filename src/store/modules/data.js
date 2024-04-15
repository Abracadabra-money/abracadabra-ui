export default {
  state: {
    cauldronsList: {
      isCreated: false,
      data: [],
    },
    userPositions: {
      isCreated: false,
      data: [],
    },
    farmList: [],
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList.isCreated = true;
      state.cauldronsList.data = payload;
    },
    setUserPositions(state, payload) {
      state.userPositions.isCreated = true;
      state.userPositions.data = payload;
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
