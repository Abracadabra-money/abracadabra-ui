export default {
  state: {
    mApeStakingObj: null,
    mLvlStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingMApeStake: true,
    isLoadingMLvlStake: true,
  },
  mutations: {
    setMApeStakingObj(state, payload) {
      state.mApeStakingObj = payload;
    },
    setMLvlStakingObj(state, payload) {
      state.mLvlStakingObj = payload;
    },
    setMimInBentoDepositObject(state, payload) {
      state.mimInBentoDepositObject = payload;
    },
    setLoadingMApeStake(state, payload) {
      state.isLoadingMApeStake = payload;
    },
    setLoadingMLvlStake(state, payload) {
      state.isLoadingMLvlStake = payload;
    },
  },
  getters: {
    getMApeObject: (state) => state.mApeStakingObj,
    getMLvlObject: (state) => state.mLvlStakingObj,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingMApeStake: (state) => state.isLoadingMApeStake,
    getLoadingMLvlStake: (state) => state.isLoadingMLvlStake,
  },
};
