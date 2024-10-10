//ts-nocheck

import { BigNumber } from "ethers";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import type { Address } from "viem";

// rate limit to avoid 429 error
const http = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 400,
  maxRPS: 1,
});

// TEST REALIZATION
export const swapOdosRequest = async (
  chainId: number,
  buyToken: Address,
  sellToken: Address,
  slippage = 0,
  amountSell = 0,
  takerAddress: Address
) => {
  try {
    const params = {
      chainId,
      inputTokens: [
        {
          amount: amountSell.toString(),
          tokenAddress: sellToken,
        },
      ],
      outputTokens: [
        {
          tokenAddress: buyToken,
          proportion: 1,
        },
      ],
      slippageLimitPercent: slippage,
      userAddr: takerAddress,
    };

    const quoteResponse = await http.post(`https://api.odos.xyz/sor/quote/v2`, {
      ...params,
    });

    const { pathId } = quoteResponse.data;

    const assembleResponse = await http.post(
      `https://api.odos.xyz/sor/assemble`,
      {
        pathId,
        userAddr: takerAddress,
      }
    );

    const { transaction } = assembleResponse.data;
    const buyAmount = assembleResponse.data.outputTokens[0].amount;
    const sellAmount = assembleResponse.data.inputTokens[0].amount;

    return {
      response: assembleResponse.data,
      data: transaction.data,
      to: transaction.to,
      buyToken,
      sellToken,
      buyAmount: BigNumber.from(buyAmount),
      sellAmount: BigNumber.from(sellAmount),
    };
  } catch (error) {
    console.log("swapOdosRequest error:", error);
    return error;
  }
};
