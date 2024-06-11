import { useImage } from "@/helpers/useImage";

const configs = [
  {
    id: 8,
    chain: 43114,
    href: "https://app.sushi.com/add/ETH/0x130966628846BFd36ff31a822705796e8cb8C18D",
    label: "Get SLP Tokens",
    icon: useImage(`assets/images/get-lp-icons/sushi.png`),
  },
  {
    id: 31,
    chain: 1,
    href: "https://stargate.finance/pool/USDC-ETH/add",
    label: "Get Stargate USDC",
    icon: useImage(`assets/images/get-lp-icons/stargate.png`),
  },
  {
    id: 32,
    chain: 1,
    href: "https://stargate.finance/pool/USDT-ETH/add",
    label: "Get Stargate USDT",
    icon: useImage(`assets/images/get-lp-icons/stargate.png`),
  },
  {
    id: 33,
    chain: 1,
    href: "https://yearn.fi/vaults/1/0x5faF6a2D186448Dfa667c51CB3D695c7A6E52d8E",
    label: "Get Yearn Tokens",
    icon: useImage(`assets/images/get-lp-icons/yearn.png`),
  },
  {
    id: 38,
    chain: 1,
    href: "https://yearn.fi/vaults/1/0x8078198Fc424986ae89Ce4a910Fc109587b6aBF3",
    label: "Get Yearn Tokens",
    icon: useImage(`assets/images/get-lp-icons/yearn.png`),
  },
  {
    id: 1,
    chain: 2222,
    href: "https://curve.fi/#/kava/pools/factory-v2-17/deposit",
    label: "Get Curve Token",
    icon: useImage(`assets/images/get-lp-icons/curve.png`),
  },
  {
    id: 2,
    chain: 2222,
    href: "https://stargate.finance/pool/USDT-KAVA/add",
    label: "Get Stargate Token",
    icon: useImage(`assets/images/get-lp-icons/stargate.png`),
  },
  {
    id: 4,
    chain: 42161,
    href: "https://app.gmx.io/#/pools",
    label: "Get GM Token",
    icon: useImage(`assets/images/get-lp-icons/gmx.png`),
  },
  {
    id: 5,
    chain: 42161,
    href: "https://app.gmx.io/#/pools",
    label: "Get GM Token",
    icon: useImage(`assets/images/get-lp-icons/gmx.png`),
  },
  {
    id: 6,
    chain: 42161,
    href: "https://app.gmx.io/#/pools",
    label: "Get GM Token",
    icon: useImage(`assets/images/get-lp-icons/gmx.png`),
  },
  {
    id: 7,
    chain: 42161,
    href: "https://app.gmx.io/#/pools",
    label: "Get GM Token",
    icon: useImage(`assets/images/get-lp-icons/gmx.png`),
  },
  {
    id: 1,
    chain: 80084,
    href: "https://artio.bex.berachain.com/pool/0xC793C76fE0D5c79550034983D966c21a50Fb5e38/add-liquidity",
    label: "Get LP",
    icon: useImage(`assets/images/get-lp-icons/bera.png`),
  },
];

export const getTokenLinkData = (cauldronId: number, chainId: number) => {
  return configs.filter((config) => {
    if (config.id === cauldronId && config.chain === chainId) return true;
  })[0];
};
