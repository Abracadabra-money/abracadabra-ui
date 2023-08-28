export default {
  state: {
    mLvlStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingMLvlStake: true,
  },
  mutations: {
    setMLvlStakingObj(state, payload) {
      state.mLvlStakingObj = payload;
    },
    setMimInBentoDepositObject(state, payload) {
      state.mimInBentoDepositObject = payload;
    },

    setLoadingMLvlStake(state, payload) {
      state.isLoadingMLvlStake = payload;
    },
  },
  getters: {
    getMLvlObject: (state) => state.mLvlStakingObj,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingMLvlStake: (state) => state.isLoadingMLvlStake,
  },
};
