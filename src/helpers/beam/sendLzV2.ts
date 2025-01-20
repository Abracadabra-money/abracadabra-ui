import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import type { BeamInfo, QuoteFees, SendParam } from "@/helpers/beam/types";

export const sendLzV2 = async (
  account: Address,
  sendParam: SendParam,
  beamInfo: BeamInfo,
  fees: QuoteFees
) => {
  const { request } = await simulateContractHelper({
    address: beamInfo.fromChainConfig.contract.address,
    abi: beamInfo.fromChainConfig.contract.abi,
    functionName: "send",
    args: [sendParam, fees, account],
    value: fees.nativeFee,
  });

  const hash = await writeContractHelper(request);

  await waitForTransactionReceiptHelper({ hash });

  return hash;
};
