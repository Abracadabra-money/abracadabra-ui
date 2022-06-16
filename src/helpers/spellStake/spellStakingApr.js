// const AVAX_URL = "https://api.avax.network/ext/bc/C/rpc";
const MAINNET_URL =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
// const FTM_URL = "https://rpc.ftm.tools/";
// const AETH_URL = "https://arb1.arbitrum.io/rpc";

// const config = [
//   {
//     chain: "mainnet",
//     mspell: "0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797",
//     sspell: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9",
//     spell: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
//     url: MAINNET_URL,
//   },
//   {
//     chain: "fantom",
//     mspell: "0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569",
//     sspell: "0xbB29D2A58d880Af8AA5859e30470134dEAf84F2B",
//     spell: "0x468003B688943977e6130F4F68F23aad939a1040",
//     url: FTM_URL,
//   },
//   {
//     chain: "avalanche",
//     mspell: "0xBd84472B31d947314fDFa2ea42460A2727F955Af",
//     sspell: "0x3Ee97d514BBef95a2f110e6B9b73824719030f7a",
//     spell: "0xCE1bFFBD5374Dac86a2893119683F4911a2F7814",
//     url: AVAX_URL,
//   },
//   {
//     chain: "arbitrum",
//     mspell: "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
//     sspell: "0xF7428FFCb2581A2804998eFbB036A43255c8A8D3",
//     spell: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
//     url: AETH_URL,
//   },
// ];

// import { ethers, BigNumber, Contract } from "ethers";
import { ethers, Contract } from "ethers";

import { StaticJsonRpcProvider } from "@ethersproject/providers";
import SpellAbi from "@/utils/abi/tokensAbi/SPELL";
import sSpellAbi from "@/utils/abi/tokensAbi/sSPELL";
import moment from "moment";

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

const getSpellApr = async () => {
  const tokenRate = await getTokensRate();

  // const startDate = moment().subtract(1, "months");
  const startDate = moment("2021-5-25");
  const date = moment();

  const dayDiff = date.diff(startDate, "days");

  const apr = (((tokenRate - 1) * 100) / dayDiff) * 365;

  console.log("apr apr", apr);
  return apr;
};

const getSpellStakingApr = async () => {
  const apr = await getSpellApr();

  return {
    sSpellApr: apr,
    mSpellApr: apr,
  };

  // let totalSSpell = BigNumber.from(0);
  // let totalMSpelll = BigNumber.from(0);

  // for (const { mspell, spell, sspell, url } of config) {
  //   const provider = new StaticJsonRpcProvider(url);
  //   const contract = new Contract(spell, SpellAbi, provider);
  //   const sspellBalance = BigNumber.from(await contract.balanceOf(sspell));
  //   const mspellBalance = BigNumber.from(await contract.balanceOf(mspell));
  //   totalSSpell = totalSSpell.add(sspellBalance);
  //   totalMSpelll = totalMSpelll.add(mspellBalance);
  // }

  // if (totalSSpell.gt(BigNumber.from(0)) && totalMSpelll.gt(BigNumber.from(0))) {
  //   const totalSpell = totalSSpell.add(totalMSpelll);
  //   const sRate =
  //     (Number(totalSSpell.toString()) * 100) / Number(totalSpell.toString());
  //   const mRate =
  //     (Number(totalMSpelll.toString()) * 100) / Number(totalSpell.toString());

  //   const stakingApr = {
  //     sSpellApr: (apr / 100) * sRate,
  //     mSpellApr: (apr / 100) * mRate,
  //   };

  //   return stakingApr;
  // }

  // if (totalSSpell.gt(BigNumber.from(0)) && totalMSpelll.eq(BigNumber.from(0))) {
  //   const stakingApr = {
  //     sSpellApr: apr,
  //     mSpellApr: 0,
  //   };

  //   return stakingApr;
  // }

  // if (totalSSpell.eq(BigNumber.from(0)) && totalMSpelll.gt(BigNumber.from(0))) {
  //   const stakingApr = {
  //     sSpellApr: 0,
  //     mSpellApr: apr,
  //   };

  //   return stakingApr;
  // }

  // const stakingApr = {
  //   sSpellApr: 0,
  //   mSpellApr: 0,
  // };

  // return stakingApr;
};

export { getSpellStakingApr, getSpellApr, getTokensRate };
