import bigNumberify from './big-numberify';

module.exports = (n, decimals) => bigNumberify(n).mul(bigNumberify(10).pow(decimals));