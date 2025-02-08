import type { Address } from "viem";

export const getPythConfiguration = (chainId: number): { address: Address, priceInfoSlot: bigint } => {
  let address: Address;
  switch (chainId) {
    default:
      address = "0x2880aB155794e7179c9eE2e38200202908C17B43";
  }
  let priceInfoSlot;
  switch (chainId) {
    default:
      priceInfoSlot = 213n;
  }

  return { address, priceInfoSlot }
}
