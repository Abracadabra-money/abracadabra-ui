import axios from "axios";

export default {
  state: {
    sSpellStakeObject: null,
    mimInBentoDepositObject: null,
    isLoadingsSpellStake: null,
  },
  mutations: {
    setSSpellObject(state, payload) {
      state.sSpellStakeObject = payload;
    },
    setMimInBentoDepositObject(state, payload) {
      state.mimInBentoDepositObject = payload;
    },
    setLoadingsSpellStake(state, payload) {
      state.isLoadingsSpellStake = payload;
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
    getSSpellObject: (state) => state.sSpellStakeObject,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingsSpellStake: (state) => state.isLoadingsSpellStake,
  },
};
