import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { ethers } from "ethers";

Vue.config.productionTip = false;

Vue.prototype.$ethers = ethers;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
