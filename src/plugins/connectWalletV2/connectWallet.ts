import { onConnectNew } from "@/plugins/connectWalletV2/initConnect";
import { subscribeProvider } from "@/plugins/connectWalletV2/subscribeProvider";
import { initWithoutConnect } from "@/plugins/connectWalletV2/initWithoutConnect";
import { createEthereumClients } from "@/plugins/connectWalletV2/createEthereumClients";

const { web3modal, ethereumClient } = await createEthereumClients();
const { isConnected } = await ethereumClient.getAccount();

if (isConnected) await onConnectNew(ethereumClient);
else await initWithoutConnect(ethereumClient);

export default {
  async install(Vue: any) {
    // not work
    Vue.config.globalProperties.$connectWallet = async () => {
      await subscribeProvider(web3modal, ethereumClient);
    };

    Vue.config.globalProperties.$openWeb3modal = async () => {
      await web3modal.openModal();
    };
    // todo not used
    Vue.config.globalProperties.$openNetworkModal = async () => {
      await web3modal.openModal({
        route: "SelectNetwork",
      });
    };
    // todo not used
    Vue.config.globalProperties.$closeWeb3modal = async () => {
      await web3modal.closeModal();
    };
  },
};
