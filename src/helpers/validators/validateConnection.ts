import { getAccountHelper } from "@/helpers/walletClienHelper";

export const validateConnection = () => {
  const { isConnected } = getAccountHelper();

  if (!isConnected)
    return {
      btnText: "Connect Wallet",
      isAllowed: true,
      method: "connectWallet",
    };
  return { btnText: false, isAllowed: true };
};
