import {
  getUserEnsName,
  commitWalletData,
  checkUnSupportedChain,
  checkSanctionAddress,
} from "@/plugins/walletConnect/utils";
import { markRaw } from "vue";
import { getAccount } from "@wagmi/core";
import type { Config } from "@wagmi/core";
import { watchAccount, watchChainId } from "@wagmi/core";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";
import store from "@/store";

export const initWalletConect = async (wagmiConfig: Config) => {
  const account = getAccount(wagmiConfig).address;

  if (!account) {
    await initWithoutConnect(wagmiConfig);
  } else {
    await initConnect(wagmiConfig);
  }

  watchAccount(wagmiConfig, {
    async onChange({ isConnected, isConnecting }) {
      store.commit("setIsWalletCheckInProcess", true);

      if (!isConnected && !isConnecting) {
        await initWithoutConnect(wagmiConfig);
      }

      if (isConnected && !isConnecting) {
        await initConnect(wagmiConfig);
      }

      store.commit("setIsWalletCheckInProcess", false);
    },
  });
  store.commit("setIsWalletCheckInProcess", false);
};

const initConnect = async (wagmiConfig: Config) => {
  try {
    const { address, chainId } = getAccount(wagmiConfig);
    const { unsupportedChain } = checkUnSupportedChain(chainId);

    if (await checkSanctionAddress(address!)) return false;

    const provider = markRaw(getEthersProvider(chainId));

    const ensName = await getUserEnsName(wagmiConfig, address!);

    await commitWalletData(
      chainId!,
      provider,
      address!,
      ensName,
      true,
      wagmiConfig
    );

    watchChainId(wagmiConfig, {
      onChange(id) {
        if (chainId !== id) initConnect(wagmiConfig);
      },
    });
  } catch (error) {
    console.log("Connection error: ", error);
  }
};

export const initWithoutConnect = async (wagmiConfig: Config) => {
  const chainId = +(localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || 1);
  const provider = markRaw(getEthersProvider(chainId));

  await commitWalletData(chainId!, provider, null, null, true, wagmiConfig);

  watchChainId(wagmiConfig, {
    onChange(id) {
      if (chainId !== id) initWithoutConnect(wagmiConfig);
    },
  });
};
