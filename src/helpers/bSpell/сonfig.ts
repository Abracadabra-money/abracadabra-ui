// @ts-ignore
import tokensAbi from "@/abis/tokensAbi";
import tokenBankAbi from "@/abis/tokenBank";
import { useImage } from "@/helpers/useImage";
import type { bSpellConfigs } from "@/helpers/bSpell/types";
import spellPowerStaking from "@/abis/stake/spellPowerStaking";

export const bSpellLockConfig: bSpellConfigs = {
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
    stakeInfo: {
      address: "0x081bEC437cAd6d34656Df5f1b0bd22fCef02Ca69",
      abi: spellPowerStaking,
    },
    rewardTokensInfo: [
      {
        name: "MIM",
        decimals: 18,
        icon: useImage("assets/images/tokens/MIM.png"),
        contract: {
          address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
          abi: tokensAbi.MIM,
        },
      },
      {
        name: "bSPELL",
        decimals: 18,
        icon: useImage("assets/images/tokens/bSPELL.png"),
        contract: {
          address: "0x19595E8364644F038bDda1d099820654900c3042",
          addressForPrice: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
          abi: tokensAbi.bSPELL,
        },
      },
    ],
  },
};
