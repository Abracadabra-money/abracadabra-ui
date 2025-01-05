import { ethers } from "ethers";

import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";

export const sendFrom = async (
  fromChainConfig: any,
  payload: any
): Promise<String> => {
  const itsV2 = fromChainConfig.settings.contractVersion === 2;
  const methodName = itsV2 ? "sendProxyOFTV2" : "sendFrom";

  const args = [
    payload.dstLzChainId, // remote LayerZero chainId
    payload.to, // 'to' address to send tokens
    payload.amount, // amount of tokens to send (in wei)
    [payload.account, ethers.constants.AddressZero, payload.params], // flexible bytes array to indicate messaging adapter services
  ];

  if (!itsV2) args.unshift(payload.account); // 'from' address to send tokens

  const { request } = await simulateContractHelper({
    ...fromChainConfig.contract,
    functionName: methodName,
    args,
    value: payload.fees,
  });

  const hash = await writeContractHelper(request);

  await waitForTransactionReceiptHelper({ hash });

  return hash;
};
