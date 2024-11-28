import { useImage } from "@/helpers/useImage";

export const ethereumTokens = [
  {
    name: "MIM",
    chainId: 1,
    address: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
    icon: useImage("assets/images/tokens/MIM.png"),
  },
  {
    name: "deUSD",
    chainId: 1,
    address: "0x15700B564Ca08D9439C58cA5053166E8317aa138",
    icon: useImage("assets/images/tokens/deUSD.png"),
  },
  {
    chainId: 1,
    name: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    icon: useImage("assets/images/tokens/USDT.png"),
  },
  {
    chainId: 1,
    name: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    icon: useImage("assets/images/tokens/USDC.png"),
  },
];
