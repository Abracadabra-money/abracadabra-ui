import { getPublicClient } from "@/helpers/chains/getChainsInfo";

import { BLAST_BRIDGE_ADDRESS } from "@/constants/blastLpMigration";
import BlastMagicLPBridgeAbi from "@/abis/BlastMagicLPBridge";

type BridgingFee = {
  mimFee: bigint;
  mimGas: bigint;
  usdbFee: bigint;
  usdbGas: bigint;
};

export const getEstimateBridgingFee = async (
  chainId = 81457
): Promise<BridgingFee> => {
  const publicClient = getPublicClient(chainId);

  const [estimateBridgingFee] = await publicClient.multicall({
    contracts: [
      {
        address: BLAST_BRIDGE_ADDRESS,
        abi: BlastMagicLPBridgeAbi,
        functionName: "estimateBridgingFee",
        args: [],
      },
    ],
  });

  return {
    mimFee: estimateBridgingFee.result.mimFee,
    mimGas: estimateBridgingFee.result.mimGas,
    usdbFee: estimateBridgingFee.result.usdbFee,
    usdbGas: estimateBridgingFee.result.usdbGas,
  };
};
