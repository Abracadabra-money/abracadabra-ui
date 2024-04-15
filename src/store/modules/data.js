export default {
  state: {
    cauldronsList: [],
    userPositions: [],
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList = payload;
    },
    setUserPositions(state, payload) {
      state.userPositions = payload;
    },
  },

  getters: {
    getCauldronsList: (state) => state.cauldronsList,
    getUserPositions: (state) => state.userPositions,
  },
};
