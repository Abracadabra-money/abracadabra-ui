import { getAccountHelper } from "@/helpers/walletClienHelper";

export const validateConnection = () => {
  const { isConnected } = getAccountHelper();

  if (!isConnected)
    return {
      btnText: "Connect wallet",
      isAllowed: true,
      method: "connectWallet",
    };
  return { btnText: "", isAllowed: true };
};
