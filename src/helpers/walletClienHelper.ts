import store from "@/store";
import {
  connect,
  disconnect,
  getAccount,
  switchChain,
  signMessage,
  signTypedData,
  getConnectors,
  writeContract,
  getWalletClient,
  simulateContract,
  estimateFeesPerGas,
  waitForTransactionReceipt,
} from "@wagmi/core";

export const getWalletClientHelper = async () => {
  try {
    return await getWalletClient(store.getters.getWagmiConfig);
  } catch (error) {
    return null;
  }
};

export const switchChainHelper = async (chainId: number) => {
  await switchChain(store.getters.getWagmiConfig, { chainId });
};

export const simulateContractHelper = async (txInfp: any) => {
  return await simulateContract(store.getters.getWagmiConfig, txInfp);
};

export const writeContractHelper = async (request: any) => {
  return await writeContract(store.getters.getWagmiConfig, request);
};

export const waitForTransactionReceiptHelper = async (hash: any) => {
  return await waitForTransactionReceipt(store.getters.getWagmiConfig, hash);
};

export const getAccountHelper = () => {
  return getAccount(store.getters.getWagmiConfig);
};

export const estimateFeesPerGasHelper = async () => {
  return await estimateFeesPerGas(store.getters.getWagmiConfig);
};

export const signTypedDataHelper = async (typedData: any) => {
  return await signTypedData(store.getters.getWagmiConfig, typedData);
};

export const signMessageHelper = async (message: string) => {
  return await signMessage(store.getters.getWagmiConfig, { message });
};

export const connectorsHelper: any = () => {
  return getConnectors(store.getters.getWagmiConfig);
};

export const connectHelper = async (connector: any) => {
  return await connect(store.getters.getWagmiConfig, {
    connector: connector,
  });
};

export const disconnectHelper = async () => {
  return await disconnect(store.getters.getWagmiConfig);
};
