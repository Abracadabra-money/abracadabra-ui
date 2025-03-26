// @ts-ignore
import store from "@/store";
import { markRaw } from "vue";
import { getAccount } from "@wagmi/core";
import type { Config } from "@wagmi/core";
import { MAINNET_CHAIN_ID } from "@/constants/global";
import { checkSanctionAddress } from "@/helpers/connect/utils";
import { commitWalletData, getUserEnsName } from "@/helpers/connect/utils";
import { initStaticJsonRpcProvider } from "@/helpers/connect/initStaticJsonRpcProvider";

export const createOrUpdateConnectionInfo = async (
  wagmiConfig: Config,
  isChangeChain = false
) => {
  const { address, chainId } = getAccount(wagmiConfig);

  if (isChangeChain) {
    const provider = await markRaw(initStaticJsonRpcProvider(chainId!));
    store.commit("setChainId", chainId);
    store.commit("setProvider", provider);
  } else {
    if (await checkSanctionAddress(address!)) return false;
    const provider = await markRaw(initStaticJsonRpcProvider(chainId!));
    const ensName = await getUserEnsName(wagmiConfig, address!);
    commitWalletData(chainId!, provider, address!, ensName, true, wagmiConfig);
  }
};

export const createOrUpdateWithoutConnectInfo = async (wagmiConfig: Config) => {
  const chainId = Number(
    localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || MAINNET_CHAIN_ID
  );

  const provider = await markRaw(initStaticJsonRpcProvider(chainId!));
  commitWalletData(chainId!, provider, null, null, true, wagmiConfig);
};
