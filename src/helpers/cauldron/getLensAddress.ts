import type { Address } from "viem";

export const getLensAddress = (chainId: Number): Address => {
  // check type
  switch (Number(chainId)) {
    case 80084:
      return "0x1E217d3cA2a19f2cB0F9f12a65b40f335286758E";
    default:
      return "0xd83D745203Eb041396bE5413e1720AaAa536Ed9D";
  }
};
