import endpointAbi from "@/abis/beam/endpoint.js";
import ultraLightNodeV2Abi from "@/abis/beam/UltraLightNodeV2.js";
import relayerAbi from "@/abis/beam/relayer.js";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getDstNativeAmtCap = async (
  beamConfig: any,
  dstLzChainId: number
): Promise<String> => {
  const publicClient = getPublicClient(beamConfig.chainId);

  const lzEndpointAddress = await publicClient.readContract({
    address: beamConfig.contract.address,
    abi: beamConfig.contract.abi,
    functionName: "lzEndpoint",
  });

  const defaultSendLibrary = await publicClient.readContract({
    address: lzEndpointAddress,
    abi: endpointAbi,
    functionName: "defaultSendLibrary",
  });

  const defaultAppConfig = await publicClient.readContract({
    address: defaultSendLibrary,
    abi: ultraLightNodeV2Abi,
    functionName: "defaultAppConfig",
    args: [dstLzChainId],
  });

  const dstConfig = await publicClient.readContract({
    address: defaultAppConfig.relayer,
    abi: relayerAbi,
    functionName: "dstConfigLookup",
    args: [dstLzChainId, defaultAppConfig.outboundProofType],
  });

  const dstNativeAmtCap = dstConfig.dstNativeAmtCap;

  return dstNativeAmtCap;
};
