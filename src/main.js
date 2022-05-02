import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { ethers } from "ethers";
import connectWallet from "./plugins/connectWallet";
import clickOutside from "./directives/clickOutside";
import filters from "./filters";

Vue.use(connectWallet);

Vue.directive("click-outside", clickOutside);

Vue.config.productionTip = false;

Vue.prototype.$ethers = ethers;

Object.keys(filters).forEach((filterName) => {
  Vue.filter(filterName, filters[filterName]);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
