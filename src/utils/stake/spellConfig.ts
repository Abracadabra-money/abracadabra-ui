import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import type { DefaultConfig, SpellConfigs } from "@/types/spell/configsInfo";

const spellDefauluConfig: DefaultConfig = {
  name: "SPELL",
  decimals: 18,
  icon: useImage("assets/images/spell-icon.svg"),
  abi: tokensAbi.SPELL,
};

const mSpellDefauluConfig: DefaultConfig = {
  name: "mSPELL",
  decimals: 18,
  icon: useImage("assets/images/mspell-icon.svg"),
};

export const spellConfig: SpellConfigs = {
  1: {
    spell: spellDefauluConfig,
    sSpell: {
      name: "sSPELL",
      decimals: 18,
      icon: useImage("assets/images/sspell-icon.svg"),
      contract: {
        address: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9",
        abi: tokensAbi.sSPELL,
      },
    },
    mSpell: {
      ...mSpellDefauluConfig,
      contract: {
        address: "0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797",
        abi: tokensAbi.mSPELL,
      },
    },
  },
  250: {
    spell: spellDefauluConfig,
    mSpell: {
      ...mSpellDefauluConfig,
      contract: {
        address: "0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569",
        abi: tokensAbi.mSPELL,
      },
    },
  },
  42161: {
    spell: spellDefauluConfig,
    mSpell: {
      ...mSpellDefauluConfig,
      contract: {
        address: "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
        abi: tokensAbi.mSPELL,
      },
    },
  },
  43114: {
    spell: spellDefauluConfig,
    mSpell: {
      ...mSpellDefauluConfig,
      contract: {
        address: "0xBd84472B31d947314fDFa2ea42460A2727F955Af",
        abi: tokensAbi.mSPELL,
      },
    },
  },
};
