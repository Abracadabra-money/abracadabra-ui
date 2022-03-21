import Vue from "vue";
import Vuex from "vuex";

import connectProvider from "@/store/modules/connectProvider";
import networks from "@/store/modules/networks";
import notifications from "@/store/modules/notifications";
import bridge from "@/store/modules/bridge";
import popups from "@/store/modules/popups";
import stake from "@/store/modules/stake";
import pools from "@/store/modules/pools";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    connectProvider,
    networks,
    notifications,
    bridge,
    popups,
    stake,
    pools
  },
});
