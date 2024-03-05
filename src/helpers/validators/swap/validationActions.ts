import { validateChain } from "@/helpers/validators/validateChain";
import { validateConnection } from "@/helpers/validators/validateConnection";

export const validationActions = (actionConfig: any, chainId: number) => {
  const { fromToken, toToken, fromInputValue, toInputValue } = actionConfig;

  const connectedError = validateConnection();
  if (connectedError.btnText) return connectedError;

  const chainError = validateChain(fromToken.chainId, chainId);
  if (chainError.btnText) return chainError;

  if (fromToken.name === "Select Token")
    return { btnText: "Select Token", isAllowed: false };

  if (toToken.name === "Select Token")
    return { btnText: "Select Token", isAllowed: false };

  if (!fromInputValue || !toInputValue)
    return { btnText: "Nothing to do", isAllowed: false };

  if (fromInputValue > fromToken.balance)
    return {
      btnText: `Insufficient balance ${fromToken.name}`,
      isAllowed: false,
    };

  if (fromInputValue > fromToken.approvedAmount)
    return {
      btnText: `Approve ${fromToken.name}`,
      isAllowed: true,
      method: "approvefromToken",
    };

  return { btnText: "Swap", isAllowed: true, method: "swap" };
};
