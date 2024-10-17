import axios from "axios";
import {
  ARBITRUM_CHAIN_ID,
  MAINNET_CHAIN_ID,
  ANALYTICS_URK,
} from "@/constants/global";
import { getMagicApeApy } from "@/helpers/collateralsApy/getMagicApeApy";
import { getMagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy";
import { getSpellStakingApr } from "../spell/getSpellStakingApr";

const getSpellApr = async () => {
  const spellAprs = await getSpellStakingApr();
  return spellAprs?.sSpellApr;
};

const getGlpApr = async () => {
  const glpAprs = await getMagicGlpApy(ARBITRUM_CHAIN_ID);
  return glpAprs.magicGlpApy;
};

const getApeApr = async () => {
  return await getMagicApeApy(MAINNET_CHAIN_ID);
};

export const stakeAPRGetters = {
  magicGLP: getGlpApr,
  StakeSpell: getSpellApr,
  magicAPE: getApeApr,
};
