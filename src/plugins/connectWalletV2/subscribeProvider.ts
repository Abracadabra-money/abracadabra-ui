import type { Web3Modal } from "@web3modal/html";
import type { EthereumClient } from "@web3modal/ethereum";
import { onConnectNew } from "@/plugins/connectWalletV2/initConnect";

export const subscribeProvider = async (
  web3modal: Web3Modal,
  ethereumClient: EthereumClient
) => {
  await web3modal.subscribeEvents(({ data }: any) => {
    if (data.name === "ACCOUNT_CONNECTED") onConnectNew(ethereumClient);
    if (data.name === "ACCOUNT_DISCONNECTED") window.location.reload();
  });
};
