import { BigNumber, utils } from "ethers";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import type { Address } from "viem";

const SLIPPAGE_ACCURACY = 1e4;
const SLIPPAGE_DECIMALS = 4;

const URL = "https://api.0xdreamy.dev/functions/v1/ooga-booga/v1";

// rate limit to avoid 429 error
const http = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 400,
  maxRPS: 1,
});

export const swapOogaBoogaRequest = async (
  buyToken: Address,
  sellToken: Address,
  slippage = 0,
  amountSell: BigNumber | number = 0,
  takerAddress: Address,
  chainId?: number
) => {
  try {
    const slippageBN = utils.parseUnits(String(slippage), SLIPPAGE_DECIMALS);
    const slippagePercentage = utils.formatUnits(
      slippageBN.div(100),
      SLIPPAGE_DECIMALS
    );

    const params = {
      tokenIn: sellToken,
      tokenOut: buyToken,
      amount: amountSell.toString(),
      to: takerAddress,
      slippage: slippagePercentage,
    };

    const { data } = await http.get(`${URL}/swap`, {
      params,
    });

    if (data.status !== "Success") throw new Error("OogaBooga request failed");

    const buyAmount = BigNumber.from(data.assumedAmountOut);
    const sellAmount = BigNumber.from(data.amountIn);

    const { tx } = data;

    return {
      response: data,
      data: tx.data,
      to: tx.to,
      buyToken,
      sellToken,
      buyAmount: buyAmount,
      sellAmount: sellAmount,
      buyAmountWithSlippage: applySlippage(slippagePercentage, buyAmount),
    };
  } catch (error) {
    console.log("[swapOogaBoogaRequest] error:", error);
  }
};

export function applySlippage(
  slippagePercentage: string,
  outputAmount: BigNumber
): BigNumber {
  return outputAmount
    .mul(
      BigNumber.from(
        SLIPPAGE_ACCURACY - Number(slippagePercentage) * SLIPPAGE_ACCURACY
      )
    )
    .div(BigNumber.from(SLIPPAGE_ACCURACY));
}
