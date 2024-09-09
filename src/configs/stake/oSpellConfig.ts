import tokenBankAbi from "@/abis/tokenBank";
import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";

export type SpellLockConfig = {
  spell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: string;
      abi: any;
    };
  };
  bSpell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: string;
      abi: any;
    };
  };
  tokenBank: {
    address: string;
    abi: any;
  };
};

type BSpellLockConfig = {
  [key: number]: SpellLockConfig;
};

export const bSpellLockConfig: BSpellLockConfig = {
  42161: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      contract: {
        address: "0x1DF188958A8674B5177f77667b8D173c3CdD9e51",
        abi: tokensAbi.SPELL,
      },
    },
    bSpell: {
      name: "bSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/bSPELL.png"),
      contract: {
        // address: "0xf2C62492f398c22d8330122386288C6090376F60", //prod
        address: "0x22135c40370926ed6e80371444e200f6f171cd27",
        abi: tokensAbi.bSPELL,
      },
    },
    tokenBank: {
      // address: "0x7E80586eCcA8CEb537e830F9ADd60F1816cafe21", //prod
      address: "0xa9f3a1595a383e98acba98ddd7ff3654bc7f091c",
      abi: tokenBankAbi,
    },
  },
};
