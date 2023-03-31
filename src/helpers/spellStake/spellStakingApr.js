const MAINNET_URL =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

import { ethers, Contract } from "ethers";

import { StaticJsonRpcProvider } from "@ethersproject/providers";
import SpellAbi from "@/utils/abi/tokensAbi/SPELL";
import sSpellAbi from "@/utils/abi/tokensAbi/sSPELL";
import axios from "axios";

const getTokensRate = async () => {
  const spellAddr = "0x090185f2135308BaD17527004364eBcC2D37e5F6";
  const sSpellAddr = "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9";

  const provider = new StaticJsonRpcProvider(MAINNET_URL);
  const spellContract = new Contract(spellAddr, SpellAbi, provider);
  const sSpellContract = new Contract(sSpellAddr, sSpellAbi, provider);

  const sspellBalance = await spellContract.balanceOf(sSpellAddr);
  const totalSupply = await sSpellContract.totalSupply();

  const parsedBalance = ethers.utils.formatEther(sspellBalance.toString());
  const parsedTotalSupply = ethers.utils.formatEther(totalSupply);

  const tokenRate = parsedBalance / parsedTotalSupply;

  return tokenRate;
};

const fetchSpellApr = async () => {
  try {
    const response = await axios.get(import.meta.env.VUE_APP_SPELL_APR_URL);
    return response.data.apr;
  } catch (error) {
    console.log("fetchSpellApr err:", error);
    return "N/A";
  }
};

const getSpellStakingApr = async () => {
  const apr = await fetchSpellApr();

  return {
    sSpellApr: apr,
    mSpellApr: apr,
  };
};

export { getSpellStakingApr, getTokensRate };
