type Config = {
  id: Number;
  chain: Number;
  title: String;
  type: String;
  data?: Object;
};

const configs: Array<Config> = [
  {
    id: 15,
    chain: 1,
    title: "Deposit",
    type: "3crv",
    data: {
      address: "0xd92494CB921E5C0d3A39eA88d0147bbd82E51008",
    },
  },
  {
    id: 16,
    chain: 1,
    title: "Deposit",
    type: "three-crypto-deposit",
  },
  {
    id: 24,
    chain: 1,
    title: "Deposit",
    type: "3crv",
    data: {
      address: "0xd92494CB921E5C0d3A39eA88d0147bbd82E51008",
    },
  },
  {
    id: 25,
    chain: 1,
    title: "Deposit",
    type: "3crv",
    data: {
      address: "0x3Ba207c25A278524e1cC7FaAea950753049072A4",
    },
  },
];

export const getCollateralConfig = (
  cauldronId: number,
  chainId: number
): Object => {
  return configs.filter((config) => {
    if (config.id === cauldronId && config.chain === chainId) return true;
  })[0];
};
