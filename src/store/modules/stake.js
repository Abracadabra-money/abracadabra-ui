export default {
  state: {
    sSpellStakeObject: null,
    mSpellStakingObj: null,
    mGlpStakingObj: null,
    mApeStakingObj: null,
    mLvlStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingSSpellStake: true,
    isLoadingMSpellStake: true,
    isLoadingMGlpStake: true,
    isLoadingMApeStake: true,
    isLoadingMLvlStake: true,
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
    setMApeStakingObj(state, payload) {
      state.mApeStakingObj = payload;
    },
    setMLvlStakingObj(state, payload) {
      state.mLvlStakingObj = payload;
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
    setLoadingMApeStake(state, payload) {
      state.isLoadingMApeStake = payload;
    },
    setLoadingMLvlStake(state, payload) {
      state.isLoadingMLvlStake = payload;
    },
  },
  getters: {
    getMSpellStakingObj: (state) => state.mSpellStakingObj,
    getSSpellObject: (state) => state.sSpellStakeObject,
    getMGlpObject: (state) => state.mGlpStakingObj,
    getMApeObject: (state) => state.mApeStakingObj,
    getMLvlObject: (state) => state.mLvlStakingObj,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingSSpellStake: (state) => state.isLoadingSSpellStake,
    getLoadingMSpellStake: (state) => state.isLoadingMSpellStake,
    getLoadingMGlpStake: (state) => state.isLoadingMGlpStake,
    getLoadingMApeStake: (state) => state.isLoadingMApeStake,
    getLoadingMLvlStake: (state) => state.isLoadingMLvlStake,
  },
};
