module.exports = function (chainId = 42161) {
  const _url =
    chainId === 42161 ? "gmx-io/gmx-stats" : "gmx-io/gmx-avalanche-stats";
  return `https://api.thegraph.com/subgraphs/name/${_url}`;
};
