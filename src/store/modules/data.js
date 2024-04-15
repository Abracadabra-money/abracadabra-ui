export default {
  state: {
    cauldronsList: [],
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList = payload;
    },
  },

  getters: {
    getCauldronsList: (state) => state.cauldronsList,
  },
};
