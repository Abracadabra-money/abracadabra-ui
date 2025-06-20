import { createApp } from "vue";
import { ethers } from "ethers";
import VueTippy from "vue-tippy";
import { WagmiPlugin } from "@wagmi/vue";
import "@notifi-network/notifi-react/dist/index.css";
// @ts-ignore
import store from "./store";
// @ts-ignore
import App from "./App.vue";
import router from "./router";
import { useImage } from "./helpers/useImage";
// @ts-ignore
import clickOutside from "./directives/clickOutside";
import { wagmiConfig } from "./helpers/connect/initWalletConnect";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(WagmiPlugin, { config: wagmiConfig });
app.directive("click-outside", clickOutside);
app.use(VueTippy, {
  directive: "tooltip",
  defaultProps: {
    placement: "auto",
    allowHTML: true,
    duration: 0,
  },
});
app.mount("#app");

app.config.globalProperties.$ethers = ethers;
app.config.globalProperties.$image = useImage;
