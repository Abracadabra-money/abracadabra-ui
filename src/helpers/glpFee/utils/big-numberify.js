const { BigNumber } = require("ethers");

module.exports = (n) => {
    try {
        return BigNumber.from(n);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("bigNumberify error", e);
        return undefined;
    }
}