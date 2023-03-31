import store from "./store";
import App from "./App.vue";
import router from "./router";
import { ethers } from "ethers";
import { createApp } from "vue";
import connectWallet from "./plugins/connectWallet";
import clickOutside from "./directives/clickOutside";
import VueTippy from "vue-tippy";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(connectWallet);
app.directive("click-outside", clickOutside);
app.use(VueTippy, {
  directive: "tooltip",
  defaultProps: {
    placement: "auto",
    allowHTML: true,
  },
});
app.mount("#app");

const useImage = (url: any) => {
  return new URL(`/src/${url}`, import.meta.url).href;
};

app.config.globalProperties.$ethers = ethers;
app.config.globalProperties.$image = useImage;
