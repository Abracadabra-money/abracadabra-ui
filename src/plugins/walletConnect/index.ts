import store from "@/store";
import notification from "@/helpers/notification/notification";
import { initWeb3Modal } from "@/plugins/walletConnect/initWeb3Modal";
import { initWalletConect } from "@/plugins/walletConnect/initConnect";

const { web3modal, wagmiConfig } = await initWeb3Modal();

await initWalletConect(wagmiConfig);

export default {
  async install(Vue: any) {
    Vue.config.globalProperties.$openWeb3modal = async () => {
      if (web3modal) {
        await web3modal.open();
      } else {
        store.dispatch("notifications/new", notification.connectEnvError);
      }
    };
  },
};
