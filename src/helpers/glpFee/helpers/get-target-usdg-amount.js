import bigNumberify from "../utils/big-numberify";

export default (token, usdgSupply, totalTokenWeights) => {
  if (!token || !token.weight || !usdgSupply) {
    return;
  }

  if (usdgSupply.eq(0)) {
    return bigNumberify(0);
  }

  return token.weight.mul(usdgSupply).div(totalTokenWeights);
};
