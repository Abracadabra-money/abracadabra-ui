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
  oSpell: {
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

type OSpellLockConfig = {
  [key: number]: SpellLockConfig;
};

export const oSpellLockConfig: OSpellLockConfig = {
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
    oSpell: {
      name: "OSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      contract: {
        // address: "0xBe714699689EBf7aE3a1bA58bE5fF2a59c33051A", //prod
        address: "0x22135c40370926ed6e80371444e200f6f171cd27",
        abi: tokensAbi.OSPELL,
      },
    },
    tokenBank: {
      // address: "0x6c1a332f1f5ae20cf9ebbcc3c7a6917d52b7af96", //prod
      address: "0xa9f3a1595a383e98acba98ddd7ff3654bc7f091c",
      abi: tokenBankAbi,
    },
  },
};
