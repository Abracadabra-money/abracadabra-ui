import type { BeamConfig, BeamConfigV2 } from "@/helpers/beam/types";
import { mimConfigsV1 } from "@/configs/beam/mimConfigsV1";
// import { mimConfigsV2 } from "@/configs/beam/mimConfigsV2";

export const mimConfigs: (BeamConfig | BeamConfigV2)[] = [
  ...mimConfigsV1,
  // ...mimConfigsV2,
];
