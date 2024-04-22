import {
  getAndParseCaldronsList,
  LS_CAULDRONS_LIST_KEY,
  getAndParseUserPositions,
  LS_USER_POSITION_KEY,
  getAndParseFarmsList,
  LS_FARMS_LIST_KEY,
  getAndParseBentoBoxData,
  LS_BENTOBOX_DATA_KEY,
} from "@/helpers/dataStore";

export default {
  state: {
    cauldronsList: getAndParseCaldronsList(),
    userPositions: getAndParseUserPositions(),
    farmList: getAndParseFarmsList(),
    bentoBoxData: getAndParseBentoBoxData(),
  },

  mutations: {
    setCauldronsList(state, payload) {
      state.cauldronsList.isCreated = true;
      state.cauldronsList.data = payload;
      localStorage.setItem(LS_CAULDRONS_LIST_KEY, JSON.stringify(payload));
    },
    setUserPositions(state, payload) {
      state.userPositions.isCreated = true;
      state.userPositions.data = payload;
      localStorage.setItem(LS_USER_POSITION_KEY, JSON.stringify(payload));
    },
    setFarmList(state, payload) {
      state.farmList.isCreated = true;
      state.farmList.data = payload;
      localStorage.setItem(
        LS_FARMS_LIST_KEY,
        JSON.stringify(payload, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    },
    setBentoBoxData(state, payload) {
      state.bentoBoxData.isCreated = true;
      state.bentoBoxData.data = payload;
      localStorage.setItem(
        LS_BENTOBOX_DATA_KEY,
        JSON.stringify(payload, (key, value) =>
          typeof value === "bigint"
            ? { type: "bigint", value: value.toString() }
            : value
        )
      );
    },
  },

  getters: {
    getCauldronsList: (state) => state.cauldronsList,
    getUserPositions: (state) => state.userPositions,
    getFarmList: (state) => state.farmList,
    getBentoBoxData: (state) => state.bentoBoxData,
  },
};
