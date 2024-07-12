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
  const { baseToken, quoteToken, baseInputAmount, quoteInputAmount, feeTier, I, K, poolType } =
    actionConfig;

  const connectedError = validateConnection();
  if (connectedError.btnText) return connectedError;

  const chainError = validateChain(chainId);
  if (chainError.btnText) return chainError;

  if (baseToken.config.name === "Select Token")
    return { btnText: "Select Base Token", isAllowed: false };

  if (quoteToken.config.name === "Select Token")
    return { btnText: "Select Quote Token", isAllowed: false };

  if (!poolType)
    return { btnText: "Select Pool Type", isAllowed: false };

  if (!feeTier)
    return { btnText: "Select Fee Tier", isAllowed: false };

  if (!I)
    return { btnText: "Select Price", isAllowed: false };

  if (!K)
    return { btnText: "Select K", isAllowed: false };

  if (!baseInputAmount || !quoteInputAmount)
    return { btnText: "Enter amount", isAllowed: false };

  if (baseInputAmount > baseToken.userInfo.balance)
    return {
      btnText: `Insufficient ${baseToken.config.name} balance`,
      isAllowed: false,
    };

  if (quoteInputAmount > quoteToken.userInfo.balance)
    return {
      btnText: `Insufficient ${quoteToken.config.name} balance`,
      isAllowed: false,
    };

  if (baseInputAmount > baseToken.userInfo.allowance)
    return {
      btnText: `Approve ${baseToken.config.name}`,
      isAllowed: true,
      method: "approveBaseToken",
    };

  if (quoteInputAmount > quoteToken.userInfo.allowance)
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
