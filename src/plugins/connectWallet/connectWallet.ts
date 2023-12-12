import notification from "@/helpers/notification/notification.js";
import store from "@/store";
import { onConnectNew } from "@/plugins/connectWallet/initConnect";
import { initWithoutConnect } from "@/plugins/connectWallet/initWithoutConnect";
import { createEthereumClients } from "@/plugins/connectWallet/createEthereumClients";
import { watchAccount } from "@wagmi/core";

const { web3modal, ethereumClient, projectId } = createEthereumClients();

const subscribeProvider = async () => {
  await watchAccount(({ isConnected }) => {
    console.log("herter isConnected", isConnected);
    isConnected && projectId
      ? onConnectNew(ethereumClient!)
      : window.location.reload();
  });
};

watchAccount(({ isConnected }) => {
  isConnected && projectId
    ? onConnectNew(ethereumClient!)
    : initWithoutConnect();
});

export default {
  async install(Vue: any) {
    Vue.config.globalProperties.$connectWallet = async () => {
      await subscribeProvider();
    };

    Vue.config.globalProperties.$openWeb3modal = async () => {
      if (web3modal) {
        await web3modal.open();
      } else {
        store.dispatch("notifications/new", notification.connectEnvError);
      }
    };
  },
};
