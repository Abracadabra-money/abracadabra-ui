import type { Address } from "viem";

export const routers = {
  168587773: "0x15f57fbCB7A443aC6022e051a46cAE19491bC298" as Address,
  81457: "0x73a5487f13fab384db55bb9a054f2d35ef21737e" as Address,
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
