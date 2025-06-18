import type { Address } from "viem";

export const routers = {
  168587773: "0x15f57fbCB7A443aC6022e051a46cAE19491bC298" as Address,
  81457: "0x94Ea0183A3268635E34332A76DD2e9Eff13A00f4" as Address,
  42161: "0x63d8e76143a1fd075981A44e27652aDffEE09F01" as Address,
  // 42161: "0xE6b710c2c1657938D0b6443ac14e593BAcA43E6A" as Address,
  2222: "0x526a17c623809792c033c9816Ae9a6fA80aCDfdd" as Address,
  1: "0x7202B7ca846fc93467E95fa279bC6085F2d5b6FE" as Address,
  6900: "0x6C0fB20908Bb1AE089Af7b2dE774968Add8fD5b7" as Address,
};

export const factories = {
  81457: "0x7E05363E225c1c8096b1cd233B59457104B84908" as Address,
  42161: "0x8D0Cd3eEf1794F59F2B3a664Ef07fCAD401FEc73" as Address,
  2222: "0x7Ad0e580d8458BbeF71EC6A1755c59651E1EAaa7" as Address,
  1: "0xDF46F6b1a5F794F21eaD4008C7De4E02Dc045297" as Address,
  6900: "0xD6b8bd85A9593cb47c8C15C95bbF3e593c5Dc591" as Address,
};

export const getSwapRouterByChain = (chainId: number): Address => {
  switch (chainId) {
    case 168587773:
      return routers[168587773];
    case 81457:
      return routers[81457];
    case 42161:
      return routers[42161];
    case 2222:
      return routers[2222];
    case 1:
      return routers[1];
    case 6900:
      return routers[6900];
    default:
      throw new Error("ChainId not supported");
  }
};

export const getRouterFactoryByChain = (chainId: number): Address => {
  switch (chainId) {
    case 81457:
      return factories[81457];
    case 42161:
      return factories[42161];
    case 2222:
      return factories[2222];
    case 1:
      return factories[1];
    case 6900:
      return factories[6900];
    default:
      throw new Error("ChainId not supported");
  }
};
