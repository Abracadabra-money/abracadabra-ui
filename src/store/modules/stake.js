export default {
  state: {
    sSpellStakeObject: null,
    mSpellStakingObj: null,
    mGlpStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingSSpellStake: true,
    isLoadingMSpellStake: true,
    isLoadingMGlpStake: true,
  },
  mutations: {
    setSSpellObject(state, payload) {
      state.sSpellStakeObject = payload;
    },
    setMSpellStakingObj(state, payload) {
      state.mSpellStakingObj = payload;
    },
    setMGlpStakingObj(state, payload) {
      state.mGlpStakingObj = payload;
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
    setLoadingMGlpStake(state, payload) {
      state.isLoadingMGlpStake = payload;
    },
  },
  getters: {
    getMSpellStakingObj: (state) => state.mSpellStakingObj,
    getSSpellObject: (state) => state.sSpellStakeObject,
    getMGlpObject: (state) => state.mGlpStakingObj,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingSSpellStake: (state) => state.isLoadingSSpellStake,
    getLoadingMSpellStake: (state) => state.isLoadingMSpellStake,
    getLoadingMGlpStake: (state) => state.isLoadingMGlpStake,
  },
};
