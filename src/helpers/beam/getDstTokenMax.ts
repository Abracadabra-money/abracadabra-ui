import { Contract, ethers, providers } from "ethers";
import endpointAbi from "@/abis/beam/endpoint.js";
import ultraLightNodeV2Abi from "@/abis/beam/UltraLightNodeV2.js";
import relayerAbi from "@/abis/beam/relayer.js";

export const getDstTokenMax = async (
  beamContract: Contract,
  signer: providers.BaseProvider,
  dstChainId: number
): Promise<String> => {
  const lzEndpointAddress = await beamContract.lzEndpoint();

  const endpointContract = await new Contract(
    lzEndpointAddress,
    JSON.stringify(endpointAbi),
    signer
  );

  const libraryAddress = await endpointContract.defaultSendLibrary();

  const libraryContract = await new Contract(
    libraryAddress,
    JSON.stringify(ultraLightNodeV2Abi),
    signer
  );

  const config = await libraryContract.defaultAppConfig(dstChainId);

  const relayerContract = await new Contract(
    config.relayer,
    JSON.stringify(relayerAbi),
    signer
  );

  const response = await relayerContract.dstConfigLookup(
    dstChainId,
    config.outboundProofType
  );

  return ethers.utils.formatUnits(response.dstNativeAmtCap, 18);
};
