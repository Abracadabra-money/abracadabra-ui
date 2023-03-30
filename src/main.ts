import store from "./store";
import App from "./App.vue";
import router from "./router";
import { ethers } from "ethers";
import { createApp } from "vue";
import connectWallet from "./plugins/connectWallet";
import clickOutside from "./directives/clickOutside";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(connectWallet);
app.directive("click-outside", clickOutside);
app.mount("#app");

app.config.globalProperties.$ethers = ethers;
