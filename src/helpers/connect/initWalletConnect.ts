// @ts-ignore
import store from "@/store";
import { createStorage } from "@wagmi/core";
import { chains } from "@/helpers/connect/configs";
import { createConnectors } from "@/helpers/connect/utils";
import { createConnectTransport } from "@/helpers/connect/utils";
import { createConfig, watchAccount, watchChainId } from "@wagmi/core";
import { createOrUpdateConnectionInfo } from "@/helpers/connect/createOrUpdateConnection";
import { createOrUpdateWithoutConnectInfo } from "@/helpers/connect/createOrUpdateConnection";

const wagmiConfig = createConfig({
  chains,
  connectors: createConnectors(),
  transports: createConnectTransport(),
  storage: createStorage({ storage: window.localStorage }),
});

watchAccount(wagmiConfig, {
  async onChange({ isConnected, isConnecting }) {
    store.commit("setIsWalletCheckInProcess", true);

    if (!isConnected && !isConnecting) {
      await createOrUpdateWithoutConnectInfo(wagmiConfig);
    }

    if (isConnected && !isConnecting) {
      await createOrUpdateConnectionInfo(wagmiConfig);
    }

    store.commit("setIsWalletCheckInProcess", false);
  },
});

watchChainId(wagmiConfig, {
  async onChange() {
    await createOrUpdateConnectionInfo(wagmiConfig, true);
  },
});

export { wagmiConfig };
