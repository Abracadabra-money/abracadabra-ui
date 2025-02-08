import type { Address } from "viem";

export const getPythAddress = (chainId: number): Address => {
  switch (chainId) {
    default:
      return "0x2880aB155794e7179c9eE2e38200202908C17B43";
  }
}
