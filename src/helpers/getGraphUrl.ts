export const CAULDRON_GRAPH_URL_PARAMS: any = {
  1: "cauldrons",
  10: "cauldrons-optimism",
  250: "cauldrons-fantom",
  42161: "cauldrons-arbitrum",
  43114: "cauldrons-avalanche",
};

export const getGraphUrl = (chainId: number) => {
  return `${import.meta.env.VITE_APP_GRAPH_BASE_URL}${
    CAULDRON_GRAPH_URL_PARAMS[chainId as keyof typeof CAULDRON_GRAPH_URL_PARAMS]
  }/version/latest/`;
};
