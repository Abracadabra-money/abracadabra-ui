import bigNumberify from "./big-numberify";

export default (n, decimals) =>
  bigNumberify(n).mul(bigNumberify(10).pow(decimals));
