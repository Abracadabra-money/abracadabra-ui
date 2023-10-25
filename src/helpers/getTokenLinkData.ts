type Config = {
  id: Number;
  chain: Number;
  href: String;
  label: String;
};

const configs: Array<Config> = [
  {
    id: 8,
    chain: 43114,
    href: "https://app.sushi.com/add/ETH/0x130966628846BFd36ff31a822705796e8cb8C18D",
    label: "Get SLP Tokens",
  },
  {
    id: 31,
    chain: 1,
    href: "https://stargate.finance/pool/USDC-ETH/add",
    label: "Get Stargate USDC",
  },
  {
    id: 32,
    chain: 1,
    href: "https://stargate.finance/pool/USDT-ETH/add",
    label: "Get Stargate USDT",
  },
  {
    id: 33,
    chain: 1,
    href: "https://yearn.fi/vaults/1/0x5faF6a2D186448Dfa667c51CB3D695c7A6E52d8E",
    label: "Get Yearn Tokens",
  },
  {
    id: 38,
    chain: 1,
    href: "https://yearn.fi/vaults/1/0x8078198Fc424986ae89Ce4a910Fc109587b6aBF3",
    label: "Get Yearn Tokens",
  },
  {
    id: 43,
    chain: 1,
    href: "https://curve.fi/#/ethereum/pools/factory-tricrypto-1/deposit",
    label: "Get Yearn Token",
  },
];

export const getTokenLinkData = (
  cauldronId: number,
  chainId: number
): Object => {
  return configs.filter((config) => {
    if (config.id === cauldronId && config.chain === chainId) return true;
  })[0];
};
