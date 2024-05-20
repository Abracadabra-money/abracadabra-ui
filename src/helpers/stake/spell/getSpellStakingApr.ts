import axios from "axios";

export const getSpellStakingApr = async (): Promise<{
  sSpellApr: string;
  mSpellApr: string;
}> => {
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
