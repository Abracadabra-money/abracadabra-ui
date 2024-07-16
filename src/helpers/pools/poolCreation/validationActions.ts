import { validateConnection } from "@/helpers/validators/validateConnection";
import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { PoolTypes } from "@/views/pool/PoolCreation.vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";

type ValidationData = {
  btnText: string;
  isAllowed: boolean;
  method?: string;
};

const SUPPORTED_CHAINS = [42161];

export const validationActions = (
  baseToken: PoolCreationTokenInfo,
  quoteToken: PoolCreationTokenInfo,
  actionConfig: ActionConfig,
  poolType: PoolTypes | null,
  chainId: number
): ValidationData => {
  const { baseInAmount, quoteInAmount, lpFeeRate, I, K } =
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

  if (!lpFeeRate)
    return { btnText: "Select Fee Tier", isAllowed: false };

  if (!I)
    return { btnText: "Select Price", isAllowed: false };

  if (!K)
    return { btnText: "Select K", isAllowed: false };

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
