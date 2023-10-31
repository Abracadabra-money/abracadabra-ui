const BASE_GRAPH_URL = "https://api.studio.thegraph.com/proxy/56065/";

const query = {
  1: "cauldrons",
  10: "cauldrons-optimism",
  250: "cauldrons-fantom",
  42161: "cauldrons-arbitrum",
  43114: "cauldrons-avalanche",
};

export const getGraphUrl = (chainId: number) => {
  return `${BASE_GRAPH_URL}${
    query[chainId as keyof typeof query]
  }/version/latest/`;
};
