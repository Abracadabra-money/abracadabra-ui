import type { BeamInfo } from "@/helpers/beam/types";

export const getBeamFromChainInfo = (
  beamInfo: BeamInfo[],
  fromChainId: number,
  toChainId: number | null
) => {
  if (!toChainId) {
    return beamInfo.find((chain) => chain.chainId === fromChainId);
  }

  const fromChainConfigs = beamInfo.filter(
    (chain) => chain.chainId === fromChainId
  );

  const toChainConfigs = beamInfo.filter(
    (chain) => chain.chainId === toChainId
  );

  const fromChainV2Config = fromChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  const toChainV2Config = toChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  if (fromChainV2Config && toChainV2Config) return fromChainV2Config;

  return beamInfo.find((chain) => chain.chainId === fromChainId);
};

export const getBeamToChainInfo = (
  beamInfo: BeamInfo[],
  toChainId: number | null
) => {
  if (!toChainId) return null;

  const toChainConfigs = beamInfo.filter(
    (chain) => chain.chainId === toChainId
  );

  const toChainV2Config = toChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  if (toChainV2Config) return toChainV2Config;

  return toChainConfigs[0];
};
