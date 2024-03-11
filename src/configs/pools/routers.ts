export const routers = {
  168587773: "0x15f57fbCB7A443aC6022e051a46cAE19491bC298",
};

export const getSwapRouter = (chainId: number) => {
  switch (chainId) {
    case 168587773:
      return routers[168587773];
    default:
      throw new Error("ChainId not supported");
  }
};
