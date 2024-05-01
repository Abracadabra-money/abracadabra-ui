import type { Address } from "viem";

export const midPriceLens = {
  81457: "0xd5448076C44847212c3dAaCd789ad077153AEe16" as Address,
  42161: "0x842796fd66f9712Dd27e8d9b9baF4D89d9301B86" as Address,
  59144: "0xBFAc81D48C8B4B1d2DaF5F21b78A0C2e472497C4" as Address,
};

export const getMidPriceAddressByChain = (chainId: number): Address => {
  switch (chainId) {
    case 81457:
      return midPriceLens[81457];
    case 42161:
      return midPriceLens[42161];
    case 59144:
      return midPriceLens[59144];
    default:
      throw new Error("ChainId not supported");
  }
};
