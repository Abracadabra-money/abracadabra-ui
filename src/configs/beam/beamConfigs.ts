import { MIM_ID, SPELL_ID } from "@/constants/beam";
import type { BeamConfig } from "@/helpers/beam/types";
import { mimConfigs } from "@/configs/beam/mimConfigs";
import { spellConfigs } from "@/configs/beam/spellConfigs";

interface BeamConfigs {
  [key: number]: BeamConfig[];
}

export const beamConfigs: BeamConfigs = {
  [MIM_ID]: mimConfigs,
  [SPELL_ID]: spellConfigs,
};
