import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import type { PoolTypes } from "@/constants/pools/poolCreation";
import type { Address } from "viem";

type ValidationData = {
  btnText: string;
  isAllowed: boolean;
  method?: string;
};

export const validationActions = (
  baseToken: PoolCreationTokenInfo,
  quoteToken: PoolCreationTokenInfo,
  actionConfig: ActionConfig,
  poolType: PoolTypes | null,
  currentChainId: number,
  selectedChainId: number,
  account: Address | null,
  isActionProcessing: boolean,
  identicalPoolExists: boolean,
  mobileMode: boolean
): ValidationData => {
  const { baseInAmount, quoteInAmount, lpFeeRate, I, K } = actionConfig;

  if (isActionProcessing) return { btnText: "Processing...", isAllowed: false };

  if (!account)
    return {
      btnText: "Connect wallet",
      isAllowed: true,
      method: "connectWallet",
    };

  const chainError = validateChain(currentChainId, selectedChainId);
  if (chainError.btnText) return chainError;

  if (baseToken.config.name === "Select Token")
    return { btnText: "Select Base Token", isAllowed: false };

  if (quoteToken.config.name === "Select Token")
    return { btnText: "Select Quote Token", isAllowed: false };

  if (!poolType) return { btnText: "Select Pool Type", isAllowed: false };

  if (!lpFeeRate) return { btnText: "Select Fee Tier", isAllowed: false };

  if (!I) return { btnText: "Select Price", isAllowed: false };

  if (!K) return { btnText: "Select K", isAllowed: false };

  if (identicalPoolExists && !mobileMode)
    return {
      btnText: "Go To Identical",
      isAllowed: true,
      method: "goToIdenticalPool",
    };

  if (!baseInAmount || !quoteInAmount)
    return { btnText: "Enter amount", isAllowed: false };

  if (baseInAmount > baseToken.userInfo.balance)
    return {
      btnText: `Insufficient ${baseToken.config.name} balance`,
      isAllowed: false,
    };

  if (quoteInAmount > quoteToken.userInfo.balance)
    return {
      btnText: `Insufficient ${quoteToken.config.name} balance`,
      isAllowed: false,
    };

  if (baseInAmount > baseToken.userInfo.allowance)
    return {
      btnText: `Approve ${baseToken.config.name}`,
      isAllowed: true,
      method: "approveBaseToken",
    };

  if (quoteInAmount > quoteToken.userInfo.allowance)
    return {
      btnText: `Approve ${quoteToken.config.name}`,
      isAllowed: true,
      method: "approveQuoteToken",
    };

  return { btnText: "Create", isAllowed: true, method: "createPool" };
};

const validateChain = (
  connectedChainId: number,
  selectedChainId: number,
  btnText = "Switch chain"
) => {
  if (connectedChainId !== selectedChainId)
    return {
      btnText,
      isAllowed: true,
      method: "switchNetwork",
    };

  return { btnText: "", isAllowed: true };
};
