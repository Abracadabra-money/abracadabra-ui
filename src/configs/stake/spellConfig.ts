import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import type { ContractInfo } from "@/types/global";

export type SpellStakeConfigs = {
  1: SpellStakeConfig;
  250: SpellStakeConfig;
  42161: SpellStakeConfig;
  43114: SpellStakeConfig;
};

export type SpellStakeConfig = {
  spell: SpellConfig;
  sSpell?: SSpellConfig;
  mSpell: MSpellConfig;
};

export type SpellConfig = {
  name: string;
  decimals: number;
  icon: string;
  abi: any;
};

export type SSpellConfig = {
  name: string;
  decimals: number;
  icon: string;
  contract: ContractInfo;
};

export type MSpellConfig = {
  name: string;
  decimals: number;
  icon: string;
  contract: ContractInfo;
};

export const spellStakeConfig: SpellStakeConfigs = {
  1: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      abi: tokensAbi.SPELL,
    },
    sSpell: {
      name: "sSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/sSPELL.png"),
      contract: {
        address: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9",
        abi: tokensAbi.sSPELL,
      },
    },
    mSpell: {
      name: "mSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/mSPELL.png"),
      contract: {
        address: "0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797",
        abi: tokensAbi.mSPELL,
      },
    },
  },
  250: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      abi: tokensAbi.SPELL,
    },
    mSpell: {
      name: "mSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/mSPELL.png"),
      contract: {
        address: "0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569",
        abi: tokensAbi.mSPELL,
      },
    },
  },
  42161: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      abi: tokensAbi.SPELL,
    },
    mSpell: {
      name: "mSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/mSPELL.png"),
      contract: {
        address: "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
        abi: tokensAbi.mSPELL,
      },
    },
  },
  43114: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      abi: tokensAbi.SPELL,
    },
    mSpell: {
      name: "mSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/mSPELL.png"),
      contract: {
        address: "0xBd84472B31d947314fDFa2ea42460A2727F955Af",
        abi: tokensAbi.mSPELL,
      },
    },
  },
};
