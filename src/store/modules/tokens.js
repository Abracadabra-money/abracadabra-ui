import axios from "axios";

export default {
  state: {
    sSpellStakeObject: null,
    patronumObject: null,
    mimInBentoDepositObject: null,
    isLoadingsSpellStake: null,
    isLoadingsPatronum: null,
  },
  mutations: {
    setSSpellObject(state, payload) {
      state.sSpellStakeObject = payload;
    },
    setPatronumObject(state, payload) {
      state.patronumObject = payload;
    },
    setMimInBentoDepositObject(state, payload) {
      state.mimInBentoDepositObject = payload;
    },
    setLoadingsSpellStake(state, payload) {
      state.isLoadingsSpellStake = payload;
    },
    setLoadingPatronum(state, payload) {
      state.isLoadingsPatronum = payload;
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
    getPatronumObject: (state) => state.patronumObject,
    getMimInBentoDepositObject: (state) => state.mimInBentoDepositObject,
    getLoadingsSpellStake: (state) => state.isLoadingsSpellStake,
    getLoadingPatronum: (state) => state.isLoadingsPatronum,
  },
};
