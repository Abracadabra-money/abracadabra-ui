import axios from "axios";
import type { Address } from "viem";
import rateLimit from "axios-rate-limit";
import { BigNumber, utils } from "ethers";

// rate limit to avoid 429 error
const http = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 400,
  maxRPS: 1,
});

const SLIPPAGE_ACCURACY = 1e4;
const SLIPPAGE_DECIMALS = 4;

const SWAP_PROXY_ENDPOINT =
  "https://api.0xdreamy.dev/functions/v1/zeroex/swap/allowance-holder/quote";

export type Swap0xV2Response = {
  buyAmount: BigNumber;
  buyAmountWithSlippage: BigNumber;
  buyToken: Address | string;
  data: Address;
  response: any;
  sellAmount: BigNumber;
  sellAmountWithSlippage: BigNumber;
  sellToken: Address | string;
  to: Address;
};

export const swap0xRequestV2 = async (
  chainId: number | string,
  buyToken: Address | string,
  sellToken: Address | string,
  slippage = 0 as number | string,
  amountSell = 0 as number | bigint,
  takerAddress: Address | string,
  amountBuy = 0
): Promise<Swap0xV2Response> => {
  try {
    const slippageBN = utils.parseUnits(slippage.toString(), SLIPPAGE_DECIMALS);
    const slippagePercentage = utils.formatUnits(
      slippageBN.div(100),
      SLIPPAGE_DECIMALS
    );

    let params;

    if (amountSell > 0) {
      params = {
        chainId,
        buyToken: buyToken,
        sellToken: sellToken,
        sellAmount: amountSell.toString(),
        slippagePercentage,
        skipValidation: true,
        taker: takerAddress,
        enableSlippageProtection: true,
      };
    } else {
      params = {
        chainId,
        buyToken: buyToken,
        sellToken: sellToken,
        buyAmount: amountBuy.toString(),
        slippagePercentage,
        skipValidation: true,
        taker: takerAddress,
        enableSlippageProtection: true,
      };
    }

    const response = await http.get(SWAP_PROXY_ENDPOINT, {
      params: params,
      headers: {
        // "0x-api-key": import.meta.env.VITE_APP_0X_API_KEY,
        // "0x-version": "v2",
      },
    });

    const { transaction, buyAmount, sellAmount } = response.data;

    return {
      response: response.data,
      data: transaction.data,
      to: transaction.to,
      buyToken,
      sellToken,
      buyAmount: BigNumber.from(buyAmount),
      sellAmount: BigNumber.from(sellAmount),
      buyAmountWithSlippage: BigNumber.from(buyAmount)
        .mul(
          BigNumber.from(
            SLIPPAGE_ACCURACY - Number(slippagePercentage) * SLIPPAGE_ACCURACY
          )
        )
        .div(BigNumber.from(SLIPPAGE_ACCURACY)),
      sellAmountWithSlippage: BigNumber.from(sellAmount)
        .mul(
          BigNumber.from(
            SLIPPAGE_ACCURACY - Number(slippagePercentage) * SLIPPAGE_ACCURACY
          )
        )
        .div(BigNumber.from(SLIPPAGE_ACCURACY)),
    };
  } catch (error) {
    console.log("swap0xV2Request error:", error);
    throw new Error(`${error}`);
  }
};
