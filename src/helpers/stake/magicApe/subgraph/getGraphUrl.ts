const query = {
  1: "abra-test-mainnet/v0.0.1",
  42161: "abta-test-arbitrum/v0.0.2",
  43114: "abra-test-avalanche/v0.0.2",
};

export const getGraphUrl = (chainId: number): string => {
  return `https://api.studio.thegraph.com/query/4540/${
    query[chainId as keyof typeof query]
  }`;
};
