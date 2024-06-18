import type { Address } from "viem";
import { BLAST_BRIDGE_ADDRESS } from "@/constants/blastLpMigration";
import BlastMagicLPBridgeAbi from "@/abis/BlastMagicLPBridge";
import merkleProof from "../merkleProof.json";
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";

import { getEstimateBridgingFee } from "../beam";

type BridgePayload = {
  lpAmount: bigint;
  minMIMAmount: bigint;
  minUSDBAmount: bigint;
};

export const bridgeWithProofs = async (
  account: Address,
  payload: BridgePayload
) => {
  try {
    const proof = merkleProof.items.find(
      (item) => item.account.toLowerCase() === account.toLowerCase()
    )!;

    const fees = await getEstimateBridgingFee();

    const args = [
      payload.lpAmount,
      payload.minMIMAmount,
      payload.minUSDBAmount,
      fees,
      proof,
    ];

    const value = fees.mimGas + fees.usdbGas;

    const { request } = await simulateContractHelper({
      constract: {
        address: BLAST_BRIDGE_ADDRESS,
        abi: BlastMagicLPBridgeAbi,
      },
      functionName: "bridgeWithProofs",
      args,
      value,
    });

    const hash = await writeContractHelper(request);

    await waitForTransactionReceiptHelper({ hash });

    return hash;
  } catch (error) {
    console.error("bridgeWithProofs error:", error);
  }
};
