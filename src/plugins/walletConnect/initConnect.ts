import {
  getUserEnsName,
  commitWalletData,
  getJsonRpcSigner,
  checkUnSupportedChain,
  checkSanctionAddress,
  getStaticJsonRpcProvider,
} from "@/plugins/walletConnect/utils";
import { getAccount } from "@wagmi/core";
import type { Config } from "@wagmi/core";
import { watchAccount, watchChainId } from "@wagmi/core";

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

    const provider = await getStaticJsonRpcProvider(unsupportedChain, chainId);
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

const initWithoutConnect = async (wagmiConfig: Config) => {
  const chainId = +(localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || 1);
  const { unsupportedChain } = checkUnSupportedChain(chainId);
  const provider = await getStaticJsonRpcProvider(unsupportedChain, chainId);

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
      if (chainId !== id) initConnect(wagmiConfig);
    },
  });
};
