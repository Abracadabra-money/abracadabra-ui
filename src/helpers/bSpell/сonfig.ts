import tokenBankAbi from "@/abis/tokenBank";
import { useImage } from "@/helpers/useImage";
// @ts-ignore
import tokensAbi from "@/abis/tokensAbi/index";
import type { LockerConfigs } from "@/helpers/bSpell/types";

export const bSpellLockConfig: LockerConfigs = {
  42161: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      contract: {
        address: "0x34FbFB3e95011956aBAD82796f466bA88895f214",
        abi: tokensAbi.SPELL,
      },
    },
    bSpell: {
      name: "bSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/bSPELL.png"),
      contract: {
        address: "0x19595E8364644F038bDda1d099820654900c3042",
        abi: tokensAbi.bSPELL,
      },
    },
    tokenBank: {
      address: "0xD68a4D4811C4F8263289e5D31DA36a6625e14823",
      abi: tokenBankAbi,
    },
  },
};
