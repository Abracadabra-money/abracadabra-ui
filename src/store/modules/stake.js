// todo state
export default {
  state: {
    mGlpStakingObj: null,
    mApeStakingObj: null,
    mLvlStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingMGlpStake: true,
    isLoadingMApeStake: true,
    isLoadingMLvlStake: true,
  },
  mutations: {
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
    getMGlpObject: (state) => state.mGlpStakingObj,
    getMApeObject: (state) => state.mApeStakingObj,
    getMLvlObject: (state) => state.mLvlStakingObj,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingMGlpStake: (state) => state.isLoadingMGlpStake,
    getLoadingMApeStake: (state) => state.isLoadingMApeStake,
    getLoadingMLvlStake: (state) => state.isLoadingMLvlStake,
  },
};
