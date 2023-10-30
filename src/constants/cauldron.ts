import { useImage } from "@/helpers/useImage";
import type { Address } from "viem";

export const MAX_ALLOWANCE_VALUE: Address =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const COLLATERAL_EMPTY_DATA: Object = {
  name: "",
  icon: "",
  balance: { value: 0 },
};

export const MIM_EMPTY_DATA = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
};
