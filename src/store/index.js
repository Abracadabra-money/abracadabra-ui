import Vue from "vue";
import Vuex from "vuex";

import connectProvider from "@/store/modules/connectProvider";
import notifications from "@/store/modules/notifications";
import bridge from "@/store/modules/bridge";
import popups from "@/store/modules/popups";
import stake from "@/store/modules/stake";
import borrowPools from "@/store/modules/borrowPools";
import farms from "@/store/modules/farms";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    connectProvider,
    notifications,
    bridge,
    popups,
    stake,
    borrowPools,
    farms,
  },
});
