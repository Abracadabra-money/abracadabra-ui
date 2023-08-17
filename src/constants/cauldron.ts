import { useImage } from "@/helpers/useImage";

export const MAX_ALLOWANCE_VALUE: String =
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
