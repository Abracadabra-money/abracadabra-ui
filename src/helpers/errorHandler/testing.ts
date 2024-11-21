import axios from "axios";

import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import mimTokenInfo from "@/configs/tokens/mim";

import {
    writeContractHelper,
    simulateContractHelper,
    waitForTransactionReceiptHelper,
  } from "@/helpers/walletClienHelper";

export const testAxiosError = async () => {
  return axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .catch((error) => {
      console.log(error);
    });
};

export const testCustomError = async () => {
  throw new Error("Custom error");
};

export const testReadContractError = async () => {
  const chainId = 1;
  const publicClient = getPublicClient(chainId);

  const mimInfo = mimTokenInfo.find((token) => token.chainId === chainId);

  const result = await publicClient.readContract({
    address: mimInfo!.address,
    abi: mimInfo!.abi as any,
    functionName: "method",
    args: [],
  });

  console.log(result);
};

export const testWriteContractError = async () => {
    const { request } = await simulateContractHelper({
        ...contract,
        functionName: "approve",
        args: [spender, allowanceValue],
      });
  
      const hash = await writeContractHelper(request);
  
      await waitForTransactionReceiptHelper({
        hash,
      });
};
