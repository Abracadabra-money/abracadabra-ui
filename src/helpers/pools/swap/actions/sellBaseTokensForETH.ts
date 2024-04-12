import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import type { Address } from "viem";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";

export type SellBaseTokensForETHPayload = {
  lp: Address;
  to: Address;
  amountIn: bigint;
  minimumOut: bigint;
  deadline: bigint;
};

export const sellBaseTokensForETH = async (
  swapRouterAddress: Address,
  payload: SellBaseTokensForETHPayload
) => {
  const { lp, to, amountIn, minimumOut, deadline } = payload;

  const { request } = await simulateContractHelper({
    address: swapRouterAddress,
    abi: BlastMIMSwapRouterAbi,
    functionName: "sellBaseTokensForETH",
    args: [lp, to, amountIn, minimumOut, deadline],
  });

  const hash = await writeContractHelper(request);

  return await waitForTransactionReceiptHelper({ hash });
};
