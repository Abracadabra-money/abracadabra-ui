import type { BeamInfo } from "@/helpers/beam/types";

export const getBeamChainInfo = (
  beamInfo: BeamInfo,
  fromChainId: number,
  toChainId: number
) => {
  const fromChainConfigs = beamInfo.beamConfigs.filter(
    (chain) => chain.chainId === fromChainId
  );

  const toChainConfigs = beamInfo.beamConfigs.filter(
    (chain) => chain.chainId === toChainId
  );

  const fromChainV2Config = fromChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  const toChainV2Config = toChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  if (fromChainV2Config && toChainV2Config) {
    return {
      fromChain: fromChainV2Config,
      toChain: toChainV2Config,
    };
  }

  return {
    fromChain: fromChainConfigs.find((chain) => !chain.settings?.lzVersion),
    toChain: toChainConfigs.find((chain) => !chain.settings?.lzVersion),
  };
};

export const getBeamFromChainInfo = (
  beamInfo: BeamInfo,
  fromChainId: number,
  toChainId: number | null
) => {
  if (!toChainId) {
    return beamInfo.beamConfigs.find((chain) => chain.chainId === fromChainId);
  }

  const fromChainConfigs = beamInfo.beamConfigs.filter(
    (chain) => chain.chainId === fromChainId
  );

  const toChainConfigs = beamInfo.beamConfigs.filter(
    (chain) => chain.chainId === toChainId
  );

  const fromChainV2Config = fromChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  const toChainV2Config = toChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  if (fromChainV2Config && toChainV2Config) return fromChainV2Config;

  return beamInfo.beamConfigs.find((chain) => chain.chainId === fromChainId);
};

export const getBeamToChainInfo = (
  beamInfo: BeamInfo,
  toChainId: number | null
) => {
  if (!toChainId) return null;

  const toChainConfigs = beamInfo.beamConfigs.filter(
    (chain) => chain.chainId === toChainId
  );

  const toChainV2Config = toChainConfigs.find(
    (chain) => chain.settings.lzVersion === 2
  );

  if (toChainV2Config) return toChainV2Config;

  return toChainConfigs[0];
};