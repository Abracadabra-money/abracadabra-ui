import { validateConnection } from "@/helpers/validators/validateConnection";
import type { ActionConfig } from "@/views/pool/PoolCreation.vue";

type ValidationData = {
  btnText: string;
  isAllowed: boolean;
  method?: string;
};

const SUPPORTED_CHAINS = [42161];

export const validationActions = (
  actionConfig: ActionConfig,
  chainId: number
): ValidationData => {
  const { baseToken, quoteToken, baseInputValue, quoteInputValue } =
    actionConfig;

  const connectedError = validateConnection();
  if (connectedError.btnText) return connectedError;

  const chainError = validateChain(chainId);
  if (chainError.btnText) return chainError;

  if (baseToken.config.name === "Select Token")
    return { btnText: "Select Base Token", isAllowed: false };

  if (quoteToken.config.name === "Select Token")
    return { btnText: "Select Quote Token", isAllowed: false };

  if (!baseInputValue || !quoteInputValue)
    return { btnText: "Enter amount", isAllowed: false };

  if (baseInputValue > baseToken.userInfo.balance)
    return {
      btnText: `Insufficient ${baseToken.config.name} balance`,
      isAllowed: false,
    };

  if (quoteInputValue > quoteToken.userInfo.balance)
    return {
      btnText: `Insufficient ${quoteToken.config.name} balance`,
      isAllowed: false,
    };

  if (baseInputValue > baseToken.userInfo.allowance)
    return {
      btnText: `Approve ${baseToken.config.name}`,
      isAllowed: true,
      method: "approveBaseToken",
    };

  if (quoteInputValue > quoteToken.userInfo.allowance)
    return {
      btnText: `Approve ${quoteToken.config.name}`,
      isAllowed: true,
      method: "approveQuoteToken",
    };

  return { btnText: "Create", isAllowed: true, method: "swap" };
};

const validateChain = (
  connectedChainId: number,
  btnText = "Switch network"
) => {
  if (!SUPPORTED_CHAINS.includes(connectedChainId))
    return {
      btnText,
      isAllowed: true,
      method: "switchNetwork",
    };

  return { btnText: "", isAllowed: true };
};
