import axios from "axios";
import type { SpellStakingApr } from "@/helpers/stake/spell/spellTypes";

export const getSpellStakingApr = async (): Promise<SpellStakingApr> => {
  try {
    const response = await axios.get(import.meta.env.VITE_APP_SPELL_APR_URL);

    return {
      sSpellApr: response.data.apr,
      mSpellApr: response.data.apr,
    };
  } catch (error) {
    console.log("Get Spell Staking Apr Error:", error);
    return {
      sSpellApr: "N/A",
      mSpellApr: "N/A",
    };
  }
};
