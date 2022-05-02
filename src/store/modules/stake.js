export default {
  state: {
    sSpellStakeObject: null,
    mSpellStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingSSpellStake: true,
    isLoadingMSpellStake: true,
  },
  mutations: {
    setSSpellObject(state, payload) {
      state.sSpellStakeObject = payload;
    },
    setMSpellStakingObj(state, payload) {
      state.mSpellStakingObj = payload;
    },
    setMimInBentoDepositObject(state, payload) {
      state.mimInBentoDepositObject = payload;
    },
    setLoadingSSpellStake(state, payload) {
      state.isLoadingSSpellStake = payload;
    },
    setLoadingMSpellStake(state, payload) {
      state.isLoadingMSpellStake = payload;
    },
  },
  getters: {
    getMSpellStakingObj: (state) => state.mSpellStakingObj,
    getSSpellObject: (state) => state.sSpellStakeObject,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingSSpellStake: (state) => state.isLoadingSSpellStake,
    getLoadingMSpellStake: (state) => state.isLoadingMSpellStake,
  },
};
