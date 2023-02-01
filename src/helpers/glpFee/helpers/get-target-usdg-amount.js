const bigNumberify = require('../utils/big-numberify');

module.exports = (token, usdgSupply, totalTokenWeights) => {
    if (!token || !token.weight || !usdgSupply) {
        return;
      }
    
      if (usdgSupply.eq(0)) {
        return bigNumberify(0);
      }
    
      return token.weight.mul(usdgSupply).div(totalTokenWeights);
}