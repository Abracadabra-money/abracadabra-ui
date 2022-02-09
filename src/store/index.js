import Vue from "vue";
import Vuex from "vuex";

import connectProvider from "@/store/modules/connectProvider";
import networks from "@/store/modules/networks";
import notification from "@/store/modules/notification";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    connectProvider,
    networks,
    notification
  },
});
