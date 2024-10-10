import type { ActionConfig } from "@/helpers/pools/swap/getSwapInfo";
import { validateConnection } from "@/helpers/validators/validateConnection";
import type { Address } from "viem";
const SUPPORTED_CHAINS = [1, 42161, 2222, 81457]; //TODO: Import from config

export const validationActions = (
  actionConfig: ActionConfig,
  selectedNetwork: number,
  chainId: number,
  account: Address,
  isApproving: boolean
) => {
  const { fromToken, toToken, fromInputValue, toInputValue } = actionConfig;

  const connectedError = account
    ? { btnText: false, isAllowed: true }
    : {
        btnText: "Connect Wallet",
        isAllowed: true,
        method: "connectWallet",
      };
  if (connectedError.btnText) return connectedError;

  const chainError = validateChain(selectedNetwork, chainId);
  if (chainError.btnText) return chainError;

  if (fromToken.config.name === "Select Token")
    return { btnText: "Select Token", isAllowed: false };

  if (toToken.config.name === "Select Token")
    return { btnText: "Select Token", isAllowed: false };

  if (!fromInputValue || !toInputValue)
    return { btnText: "Enter Amount", isAllowed: false };

  if (fromInputValue > fromToken.userInfo.balance)
    return {
      btnText: `Insufficient Balance`,
      isAllowed: false,
    };

  if (isApproving) return { btnText: "Approving", isAllowed: false };

  if (fromInputValue > fromToken.userInfo.allowance)
    return {
      btnText: `Approve ${fromToken.config.name}`,
      isAllowed: true,
      method: "approvefromToken",
    };

  return { btnText: "Review Trade", isAllowed: true, method: "swap" };
};

const validateChain = (
  selectedNetwork: number,
  connectedChainId: number,
  btnText = "Switch Network"
) => {
  if (
    !SUPPORTED_CHAINS.includes(connectedChainId) ||
    selectedNetwork !== connectedChainId
  )
    return {
      btnText,
      isAllowed: true,
      method: "switchNetwork",
    };

  return { btnText: "", isAllowed: true };
};
