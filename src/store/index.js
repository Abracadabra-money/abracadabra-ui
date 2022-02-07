import Vue from "vue";
import Vuex from "vuex";

import metamaskProvider from "@/store/modules/metamaskProvider";
import networks from "@/store/modules/networks";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    metamaskProvider,
    networks,
  },
});
