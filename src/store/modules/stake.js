import axios from "axios";

export default {
  state: {
    sSpellStakeObject: null,
    mSpellStakingObj: null,
    mimInBentoDepositObject: null,
    isLoadingsSpellStake: null,
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
    setLoadingsSpellStake(state, payload) {
      state.isLoadingsSpellStake = payload;
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
    getLoadingsSpellStake: (state) => state.isLoadingsSpellStake,
  },
};
