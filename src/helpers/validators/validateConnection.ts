import type { Address } from "viem";

export const validateConnection = (account: Address) => {
  if (!account)
    return {
      btnText: "Connect Wallet",
      isAllowed: true,
      method: "connectWallet",
    };

  return { btnText: "", isAllowed: true };
};
