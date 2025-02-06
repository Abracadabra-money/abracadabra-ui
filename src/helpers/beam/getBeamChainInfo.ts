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
