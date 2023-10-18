import lensAbi from "@/utils/abi/marketLens.js";
import type { ContractInfo } from "@/types/global";

export const getLensContractViem = (chainId: number): ContractInfo => {
  switch (chainId) {
    case 1:
      return {
        address: "0x26ecfcd82bf36427006794d41927da334f762230",
        abi: lensAbi,
      };
    case 2222:
      return {
        address: "0x2d50927A6E87E517946591A137b765fAba018E70",
        abi: lensAbi,
      };
    default:
      return {
        address: "0x73f52bd9e59edbdf5cf0dd59126cef00ecc31528",
        abi: lensAbi,
      };
  }
};
