import type { Address } from "viem";

export const routers = {
  168587773: "0x15f57fbCB7A443aC6022e051a46cAE19491bC298" as Address,
  81457: "0x94Ea0183A3268635E34332A76DD2e9Eff13A00f4" as Address,
};

export const getSwapRouterByChain = (chainId: number): Address => {
  switch (chainId) {
    case 168587773:
      return routers[168587773];
    case 81457:
      return routers[81457];
    default:
      throw new Error("ChainId not supported");
  }
};
