import {
  getUserEnsName,
  commitWalletData,
  getJsonRpcSigner,
  checkUnSupportedChain,
  checkSanctionAddress,
} from "@/plugins/walletConnect/utils";
import { markRaw } from "vue";
import { getAccount } from "@wagmi/core";
import type { Config } from "@wagmi/core";
import { watchAccount, watchChainId } from "@wagmi/core";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";

export const initWalletConect = async (wagmiConfig: Config) => {
  watchAccount(wagmiConfig, {
    onChange({ isConnected, isConnecting }) {
      if (!isConnected && !isConnecting) {
        initWithoutConnect(wagmiConfig);
      }

      if (isConnected && !isConnecting) {
        initConnect(wagmiConfig);
      }
    },
  });
};

const initConnect = async (wagmiConfig: Config) => {
  try {
    const { address, chainId } = getAccount(wagmiConfig);
    const { unsupportedChain } = checkUnSupportedChain(chainId);

    if (await checkSanctionAddress(address!)) return false;

    const provider = markRaw(getEthersProvider(chainId));

    const signer = await getJsonRpcSigner(
      unsupportedChain,
      provider,
      wagmiConfig
    );

    const ensName = await getUserEnsName(wagmiConfig, address!);

    await commitWalletData(
      chainId!,
      provider,
      signer!,
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

  await commitWalletData(
    chainId!,
    provider,
    provider,
    null,
    null,
    true,
    wagmiConfig
  );

  watchChainId(wagmiConfig, {
    onChange(id) {
      if (chainId !== id) initWithoutConnect(wagmiConfig);
    },
  });
};
