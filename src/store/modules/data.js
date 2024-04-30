import {
  bigintStringify,
  getAndParseCaldronsList,
  LS_CAULDRONS_LIST_KEY,
  getAndParseUserPositions,
  LS_USER_POSITION_KEY,
  getAndParseFarmsList,
  LS_FARMS_LIST_KEY,
  getAndParseBentoBoxData,
  LS_BENTOBOX_DATA_KEY,
  getAndParseSpellStakeData,
  LS_SPELL_STAKE_KEY,
  getAndParseMagicKlpStakeData,
  LS_MAGIC_KLP_STAKE_KEY,
  getAndParseMagicGlpStakeData,
  LS_MAGIC_GLP_STAKE_KEY,
  LS_MAGIC_GLP_STAKE_CHART_KEY,
  getAndParseMagicApeStakeData,
  LS_MAGIC_APE_STAKE_KEY,
  LS_MAGIC_APE_STAKE_CHART_KEY,
} from "@/helpers/dataStore";

export default {
  state: {
    cauldronsList: getAndParseCaldronsList(),
    userPositions: getAndParseUserPositions(),
    farmList: getAndParseFarmsList(),
    bentoBoxData: getAndParseBentoBoxData(),
    userTotalAssets: {
      data: {},
      isCreated: false,
    },
    spellStakeData: getAndParseSpellStakeData(),
    magicKlpStakeData: getAndParseMagicKlpStakeData(),
    magicGlpStakeData: getAndParseMagicGlpStakeData(),
    magicApeStakeData: getAndParseMagicApeStakeData(),
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList.isCreated = true;
      state.cauldronsList.data = payload;
      localStorage.setItem(LS_CAULDRONS_LIST_KEY, bigintStringify(payload));
    },
    setUserPositions(state, payload) {
      state.userPositions.isCreated = true;
      state.userPositions.data = payload;
      localStorage.setItem(LS_USER_POSITION_KEY, bigintStringify(payload));
    },
    setFarmList(state, payload) {
      state.farmList.isCreated = true;
      state.farmList.data = payload;
      localStorage.setItem(LS_FARMS_LIST_KEY, bigintStringify(payload));
    },
    setBentoBoxData(state, payload) {
      state.bentoBoxData.isCreated = true;
      state.bentoBoxData.data = payload;
      localStorage.setItem(LS_BENTOBOX_DATA_KEY, bigintStringify(payload));
    },
    setUserTotalAssets(state, payload) {
      state.userTotalAssets.isCreated = true;
      state.userTotalAssets.data = payload;
    },
    setSpellStakeData(state, payload) {
      state.spellStakeData.isCreated = true;
      state.spellStakeData.data = payload;
      localStorage.setItem(LS_SPELL_STAKE_KEY, bigintStringify(payload));
    },
    setMagicKlpStakeData(state, payload) {
      state.magicKlpStakeData.isCreated = true;
      state.magicKlpStakeData.data = payload;
      localStorage.setItem(LS_MAGIC_KLP_STAKE_KEY, bigintStringify(payload));
    },
    setMagicGlpStakeData(state, payload) {
      state.magicGlpStakeData.isCreated = true;
      state.magicGlpStakeData.data = payload;
      localStorage.setItem(LS_MAGIC_GLP_STAKE_KEY, bigintStringify(payload));
    },
    setMagicGlpChartData(state, payload) {
      state.magicGlpStakeData.chartData = payload;
      localStorage.setItem(
        LS_MAGIC_GLP_STAKE_CHART_KEY,
        bigintStringify(payload)
      );
    },
    setMagicApeStakeData(state, payload) {
      state.magicApeStakeData.isCreated = true;
      state.magicApeStakeData.data = payload;
      localStorage.setItem(LS_MAGIC_APE_STAKE_KEY, bigintStringify(payload));
    },
    setMagicApeChartData(state, payload) {
      state.magicApeStakeData.chartData = payload;
      localStorage.setItem(
        LS_MAGIC_APE_STAKE_CHART_KEY,
        bigintStringify(payload)
      );
    },
  },

  getters: {
    getCauldronsList: (state) => state.cauldronsList,
    getUserPositions: (state) => state.userPositions,
    getFarmList: (state) => state.farmList,
    getBentoBoxData: (state) => state.bentoBoxData,
    getUserTotalAssets: (state) => state.userTotalAssets,
    getSpellStakeData: (state) => state.spellStakeData,
    getMagicKlpStakeData: (state) => state.magicKlpStakeData,
    getMagicGlpStakeData: (state) => state.magicGlpStakeData,
    getMagicApeStakeData: (state) => state.magicApeStakeData,
  },
};
