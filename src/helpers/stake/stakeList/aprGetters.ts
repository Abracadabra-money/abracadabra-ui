import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

const getSpellApr = async () => {
  const spellAprs = await getSpellStakingApr();
  return spellAprs?.sSpellApr;
};

const getGlpApr = async () => {
  const glpAprs = await getMagicGlpApy(ARBITRUM_CHAIN_ID);
  return glpAprs.magicGlpApy;
};

export const stakeAPRGetters = {
  magicGLP: getGlpApr,
  StakeSpell: getSpellApr,
};
