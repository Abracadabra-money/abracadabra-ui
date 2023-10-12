import { onConnectNew } from "@/plugins/connectWalletV2/initConnect";
import { initWithoutConnect } from "@/plugins/connectWalletV2/initWithoutConnect";
import { createEthereumClients } from "@/plugins/connectWalletV2/createEthereumClients";
import { watchAccount } from "@wagmi/core";

const { web3modal, ethereumClient } = await createEthereumClients();

const subscribeProvider = async () => {
  await watchAccount(({ isConnected }) => {
    console.log("herter isConnected", isConnected);
    isConnected ? onConnectNew(ethereumClient) : window.location.reload();
  });
};

watchAccount(({ isConnected }) => {
  isConnected
    ? onConnectNew(ethereumClient)
    : initWithoutConnect(ethereumClient);
});

export default {
  async install(Vue: any) {
    Vue.config.globalProperties.$connectWallet = async () => {
      await subscribeProvider();
    };

    Vue.config.globalProperties.$openWeb3modal = async () => {
      await web3modal.open();
    };

    Vue.config.globalProperties.$openNetworkModal = async () => {
      await web3modal.open({ view: "Networks" });
    };

    Vue.config.globalProperties.$closeWeb3modal = async () => {
      await web3modal.close();
    };
  },
};
