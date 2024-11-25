import { useImage } from "@/helpers/useImage";

export const kavaTokens = [
  {
    name: "MIM",
    chainId: 2222,
    address: "0x471EE749bA270eb4c1165B5AD95E614947f6fCeb",
    icon: useImage("assets/images/tokens/MIM.png"),
  },
  {
    chainId: 2222,
    name: "USDT",
    address: "0x919C1c267BC06a7039e03fcc2eF738525769109c",
    icon: useImage("assets/images/tokens/USDT.png"),
  },
  {
    chainId: 2222,
    name: "wKAVA",
    address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
    icon: useImage("assets/images/tokens/KAVA.png"),
  },
];
