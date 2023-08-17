import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/utils/abi/tokensAbi/index";

export const spellConfig = {
  spell: {
    name: "SPELL",
    address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
    decimals: 18,
    abi: tokensAbi.SPELL,
    icon: useImage("assets/images/spell-icon.svg"),
  },

  sSpell: {
    name: "sSPELL",
    decimals: 18,
    abi: tokensAbi.sSPELL,
    icon: useImage("assets/images/sspell-icon.svg"),
    addresses: { 1: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9" },
  },

  mSpell: {
    name: "mSPELL",
    decimals: 18,
    abi: tokensAbi.mSPELL,
    icon: useImage("assets/images/mspell-icon.svg"),
    addresses: {
      1: "0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797",
      250: "0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569",
      43114: "0xBd84472B31d947314fDFa2ea42460A2727F955Af",
      42161: "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
    },
  },
};
