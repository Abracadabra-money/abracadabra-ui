const bigNumberify = require('./big-numberify');

module.exports = (n, decimals) => bigNumberify(n).mul(bigNumberify(10).pow(decimals));