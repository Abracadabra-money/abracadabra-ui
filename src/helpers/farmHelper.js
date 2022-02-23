import Web3 from "web3";
const web3 = new Web3();
import farmPools from "@/utils/farmPools/pools";
import store from "../store";

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

const exceptPriceAddresses = {
  SPELL: "0x090185f2135308bad17527004364ebcc2d37e5f6",
  MIM: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};

export const getFarmAddressByName = (name) => {
  const exceptAddress = exceptPriceAddresses[name.toUpperCase()];
  if (exceptAddress) return exceptAddress;
  return (
    farmPools.find(({ name: poolName }) => poolName === name)?.address || null
  );
};

export const getRpcById = (chainId) => {
  return (
    store.getters.getAvailableNetworks.find(({ chainId: id }) => id === chainId)
      ?.rpc || null
  );
};
