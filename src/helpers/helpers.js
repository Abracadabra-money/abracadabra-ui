import Web3 from "web3";
const web3 = new Web3();

export const fromWei = (value, weiFormat) => {
  return web3.utils.fromWei(value, weiFormat);
};

export const toWei = (value, weiFormat) => {
  return web3.utils.toWei(value, weiFormat);
};

export const BigInt = (value) => {
  return web3.utils.toBN(value);
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
