import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import tokenBankAbi from "@/abis/tokenBank";

export const oSpellLockConfig = {
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
        address: "0xBe714699689EBf7aE3a1bA58bE5fF2a59c33051A",
        abi: tokensAbi.OSPELL,
      },
    },
    tokenBank: {
      address: "0x6c1a332f1f5ae20cf9ebbcc3c7a6917d52b7af96",
      abi: tokenBankAbi,
    },
  },
};
