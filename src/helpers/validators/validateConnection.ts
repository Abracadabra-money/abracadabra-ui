import { getAccount } from "@wagmi/core";

export const validateConnection = () => {
  const { isConnected } = getAccount();

  if (!isConnected)
    return {
      btnText: "Connect wallet",
      isAllowed: true,
      method: "connectWallet",
    };
  return { btnText: false, isAllowed: true };
};
