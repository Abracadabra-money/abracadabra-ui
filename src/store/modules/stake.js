import axios from "axios";

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
      console.log("setSSpellObject",payload);
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
  actions: {
    async getTokenPrice(_, { from, to }) {
      try {
        const url = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
        const response = await axios.get(url);

        return response.data;
      } catch (e) {
        console.log("getTokenPrice err: ", e);
      }
    },
    async fetchTokenVaults() {
      console.log("FETCH VAULTS");
      try {
        const url = "https://api.yearn.finance/v1/chains/1/vaults/all";
        const response = await axios.get(url);
        return response.data;
      } catch (e) {
        console.log("fetchTokenVaults err: ", e);
      }
    },
  },
  getters: {
    getMSpellStakingObj: (state) => state.mSpellStakingObj,
    getSSpellObject: (state) => state.sSpellStakeObject,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingSSpellStake: (state) => state.isLoadingSSpellStake,
  },
};
