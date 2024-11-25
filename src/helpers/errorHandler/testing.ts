import axios from "axios";

import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import mimTokenInfo from "@/configs/tokens/mim";

import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";

export const testAxiosError = async () => {
  const goodExample = "https://jsonplaceholder.typicode.com/pos/1";
  const badExample =
    "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-arbitrum-stats/apid";
  return await axios.get(badExample);
};

export const testCustomError = async () => {
  throw new Error("CUSTOM_TEST_ERROR");
};

export const testReadContractError = async () => {
  const chainId = 1;
  const publicClient = getPublicClient(chainId);

  const mimInfo = mimTokenInfo.find((token) => token.chainId === chainId);

  const result = await publicClient.readContract({
    address: mimInfo!.address,
    abi: mimInfo!.abi as any,
    functionName: "ddd",
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
