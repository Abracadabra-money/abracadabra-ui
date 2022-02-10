export default {
  state: {
    bridgeObject: null,
  },
  mutations: {
    setBridgeObject(state, payload) {
      state.bridgeObject = payload;
    },
  },
  getters: {
    getBridgeObject: (state) => state.bridgeObject,
  },
};
