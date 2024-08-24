import type { PMMState } from "../types";
import { interpretContract } from "./interpretContract";
import { magicLpLensContract } from "./magicLpLens";

const sellToken = (
  state: PMMState,
  payAmount: bigint,
  functionName: "sellBaseToken" | "sellQuoteToken"
) => {
  const [receiveAmount, newR] = interpretContract({
    ...magicLpLensContract,
    functionName,
    args: [state, payAmount],
  });

  return {
    receiveAmount,
    newR,
  };
};
export const sellBaseToken = (state: PMMState, payBaseAmount: bigint) => {
  const { receiveAmount: receiveQuoteAmount, newR } = sellToken(
    state,
    payBaseAmount,
    "sellBaseToken"
  );
  return { receiveQuoteAmount, newR };
};

export const sellQuoteToken = (state: PMMState, payQuoteAmount: bigint) => {
  const { receiveAmount: receiveBaseAmount, newR } = sellToken(
    state,
    payQuoteAmount,
    "sellQuoteToken"
  );
  return { receiveBaseAmount, newR };
};

export const getMidPrice = (state: PMMState) => {
  return interpretContract({
    ...magicLpLensContract,
    functionName: "getMidPrice",
    args: [state],
  });
};

export default {
  getMidPrice,
  sellBaseToken,
  sellQuoteToken,
};
