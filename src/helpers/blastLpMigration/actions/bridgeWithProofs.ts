import type { Address } from "viem";
import {
  BLAST_BRIDGE_ADDRESS,
  DEFAULT_DEADLINE_DURATION,
} from "@/constants/blastLpMigration";
import BlastMagicLPBridgeAbi from "@/abis/BlastMagicLPBridge";
import merkleProof from "../merkleProof.json";
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";

import moment from "moment";

import { getEstimateBridgingFee } from "../beam";
import { setPermit } from "../permit";

type BridgePayload = {
  lpAmount: bigint;
  minMIMAmount: bigint;
  minUSDBAmount: bigint;
  deadline?: bigint;
};

export const bridgeWithProofs = async (
  account: Address,
  payload: BridgePayload,
  usePermit: boolean = false
) => {
  try {
    const proof = merkleProof.items.find(
      (item) => item.account.toLowerCase() === account.toLowerCase()
    )!;

    const fees = await getEstimateBridgingFee();

    const deadline =
      payload.deadline ??
      BigInt(moment().unix() + Number(DEFAULT_DEADLINE_DURATION) * 100);

    const signature = usePermit
      ? await setPermit(account, payload.lpAmount, deadline)
      : undefined;

    const args = usePermit
      ? [
          payload.lpAmount,
          payload.minMIMAmount,
          payload.minUSDBAmount,
          [fees.mimFee, fees.mimGas, fees.usdbFee, fees.usdbGas],
          deadline,
          signature?.v,
          signature?.r,
          signature?.s,
          [proof.account, proof.amount, proof.proof],
        ]
      : [
          payload.lpAmount,
          payload.minMIMAmount,
          payload.minUSDBAmount,
          [fees.mimFee, fees.mimGas, fees.usdbFee, fees.usdbGas],
          [proof.account, proof.amount, proof.proof],
        ];

    const value = fees.mimFee + fees.usdbFee;

    const functionName = usePermit
      ? "bridgeWithPermitAndProofs"
      : "bridgeWithProofs";

    const { request } = await simulateContractHelper({
      address: BLAST_BRIDGE_ADDRESS,
      abi: BlastMagicLPBridgeAbi,
      functionName,
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
