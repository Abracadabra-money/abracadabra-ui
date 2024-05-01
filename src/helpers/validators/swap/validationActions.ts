import { validateConnection } from "@/helpers/validators/validateConnection";

const SUPPORTED_CHAINS = [42161, 81457];

export const validationActions = (actionConfig: any, chainId: number) => {
  const { fromToken, toToken, fromInputValue, toInputValue } = actionConfig;

  const connectedError = validateConnection();
  if (connectedError.btnText) return connectedError;

  const chainError = validateChain(chainId);
  if (chainError.btnText) return chainError;

  if (fromToken.config.name === "Select Token")
    return { btnText: "Select Token", isAllowed: false };

  if (toToken.config.name === "Select Token")
    return { btnText: "Select Token", isAllowed: false };

  if (!fromInputValue || !toInputValue)
    return { btnText: "Enter amount", isAllowed: false };

  if (fromInputValue > fromToken.userInfo.balance)
    return {
      btnText: `Insufficient balance`,
      isAllowed: false,
    };

  if (fromInputValue > fromToken.userInfo.allowance)
    return {
      btnText: `Approve ${fromToken.config.name}`,
      isAllowed: true,
      method: "approvefromToken",
    };

  return { btnText: "Preview", isAllowed: true, method: "swap" };
};

const validateChain = (connectedChainId: number, btnText = "Wrong Chain") => {
  if (!SUPPORTED_CHAINS.includes(connectedChainId))
    return {
      btnText,
      isAllowed: false,
    };

  return { btnText: "", isAllowed: true };
};
