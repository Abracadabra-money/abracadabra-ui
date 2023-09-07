import { Contract } from "ethers";
import DegenBoxHelperAbi from "@/utils/abi/DegenBoxHelperAbi";

const DegenBoxHelpers = {
  1: "0x3AeCB01be778fAA795f156B9D3627c0E05f700a1",
  42161: "0x129149DC63F5778a41f619Bb36212566ac54eA45",
};

const getDegenBoxHelperAddress = (chainId) => {
  const address = DegenBoxHelpers[chainId];

  if (!address) {
    console.log("no DegenBoxHelper on this network");
    return false;
  }

  return address;
};

const getDegenBoxHelperContract = async (chainId, provider) => {
  const address = getDegenBoxHelperAddress(chainId);

  return new Contract(address, JSON.stringify(DegenBoxHelperAbi), provider);
};

export { getDegenBoxHelperContract, getDegenBoxHelperAddress };
