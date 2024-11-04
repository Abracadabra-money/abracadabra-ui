import tokenBankAbi from "@/abis/tokenBank";
import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import type { LockerConfigs } from "@/helpers/bSpell/types";

export const bSpellLockConfig: LockerConfigs = {
  42161: {
    spell: {
      name: "SPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/SPELL.png"),
      contract: {
        address: "0x55BE39c912621606683DEe44C4ab2Dde083Bc925",
        abi: tokensAbi.SPELL,
      },
    },
    bSpell: {
      name: "bSPELL",
      decimals: 18,
      icon: useImage("assets/images/tokens/bSPELL.png"),
      contract: {
        address: "0xd621B380DAF82566b9D41Ab71F29D5140a7595Fa",
        abi: tokensAbi.bSPELL,
      },
    },
    tokenBank: {
      address: "0x7E36D4aac20D6677f7f1ffbCc0eE1A84E4673A7A",
      abi: tokenBankAbi,
    },
  },
};
