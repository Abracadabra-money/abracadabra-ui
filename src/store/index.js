import Vue from "vue";
import Vuex from "vuex";

import connectProvider from "@/store/modules/connectProvider";
import networks from "@/store/modules/networks";
import notifications from "@/store/modules/notifications";
import bridge from "@/store/modules/bridge";
import popups from "@/store/modules/popups";
import pools from "@/store/modules/pools";
import farms from "@/store/modules/farms";

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
    pools,
    farms,
  },
});
