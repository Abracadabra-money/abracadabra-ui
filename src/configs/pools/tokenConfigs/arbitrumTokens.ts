import { useImage } from "@/helpers/useImage";

export const arbitrumTokens = [
  {
    name: "MIM",
    chainId: 42161,
    address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
    icon: useImage("assets/images/tokens/MIM.png"),
  },
  {
    chainId: 42161,
    name: "USDT",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    icon: useImage("assets/images/tokens/USDT.png"),
  },
  {
    chainId: 42161,
    name: "USDC",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    icon: useImage(`assets/images/tokens/USDC.png`),
  },
  {
    chainId: 42161,
    name: "SPELL",
    address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
    icon: useImage(`assets/images/tokens/SPELL.png`),
  },
  {
    chainId: 42161,
    name: "ARB",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    icon: useImage(`assets/images/tokens/ARB.png`),
  },
  {
    chainId: 42161,
    name: "WETH",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    icon: useImage(`assets/images/tokens/WETH.png`),
  },
  {
    chainId: 42161,
    name: "WBTC",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    icon: useImage(`assets/images/tokens/WBTC.png`),
  },
];
