import Vue from "vue";
import Vuex from "vuex";

import connectProvider from "@/store/modules/connectProvider";
import networks from "@/store/modules/networks";
import bridge from "@/store/modules/bridge";
import popups from "@/store/modules/popups";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    connectProvider,
    networks,
    bridge,
    popups,
  },
});
