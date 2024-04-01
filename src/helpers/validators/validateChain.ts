export const validateChain = (chainId: number, connectedChainId: number) => {
  if (chainId !== connectedChainId)
    return {
      btnText: "Switch Chain",
      isAllowed: true,
      method: "switchNetwork",
    };

  return { btnText: "", isAllowed: true };
};
