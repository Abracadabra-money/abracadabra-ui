export default {
  state: {
    mimInBentoDepositObject: null,
  },
  mutations: {
    setMimInBentoDepositObject(state, payload) {
      state.mimInBentoDepositObject = payload;
    },
  },
  getters: {
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
  },
};
