import { BERA_CHAIN_ID } from "@/constants/global";
import type { Address } from "viem";

export const getLensAddress = (chainId: Number): Address => {
  // check type
  switch (Number(chainId)) {
    case 80084:
      return "0x1E217d3cA2a19f2cB0F9f12a65b40f335286758E";
    case BERA_CHAIN_ID:
      return "0x7868e9e5F6952172D7a6365cBA28C7D2503a2049";
    default:
      return "0x1d17009Dde57CAea3dC614962a6c01420776523f";
  }
};
