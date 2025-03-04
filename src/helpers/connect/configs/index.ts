import type { Chain } from "viem";
import { moonriver, base, linea } from "@wagmi/core/chains";
import { beraChain } from "@/helpers/connect/configs/beraChain";
import { beraBartio } from "@/helpers/connect/configs/beraBartio";
import { mainnet, arbitrum, blast, kava } from "@wagmi/core/chains";
import { avalanche, optimism, fantom, bsc, polygon } from "@wagmi/core/chains";

export const chains: [Chain, ...Chain[]] = [
  beraChain,
  mainnet,
  arbitrum,
  blast,
  kava,
  avalanche,
  optimism,
  fantom,
  bsc,
  polygon,
  moonriver,
  base,
  linea,
  beraBartio,
];

export const getRpcByChainId = (chainId: number): string => {
  const chain = chains.find((chain) => chain.id === chainId);
  if (chain) return chain!.rpcUrls.default.http[0];

  return mainnet!.rpcUrls.default.http[0];
};

export const getAvailableChainList = () => {
  return chains.map((chain) => chain.id);
};
