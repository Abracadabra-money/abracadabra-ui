import { BigNumber } from "ethers";
import axios from "axios";
import rateLimit from "axios-rate-limit";

// rate limit to avoid 429 error
const http = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 400,
  maxRPS: 1,
});

const SLIPPAGE_ACCURACY = 1e4;

const endpoints = {
  1: "https://api.0x.org",
  10: "https://optimism.api.0x.org",
  56: "https://bsc.api.0x.org",
  137: "https://polygon.api.0x.org",
  250: "https://fantom.api.0x.org",
  42161: "https://arbitrum.api.0x.org",
  43114: "https://avalanche.api.0x.org",
};

export const swap0xRequest = async (
  chainId,
  buyToken,
  sellToken,
  slippage = 0,
  amountSell = 0,
  takerAddress,
  amountBuy = 0
) => {
  try {
    const slippagePercentage = slippage / 100;

    const endpoint = endpoints[chainId];

    let params;

    if (amountSell > 0) {
      params = {
        buyToken: buyToken,
        sellToken: sellToken,
        sellAmount: amountSell.toString(),
        slippagePercentage,
        skipValidation: true,
        takerAddress,
        enableSlippageProtection: true,
      };
    } else {
      params = {
        buyToken: buyToken,
        sellToken: sellToken,
        buyAmount: amountBuy.toString(),
        slippagePercentage,
        skipValidation: true,
        takerAddress,
        enableSlippageProtection: true,
      };
    }

    const response = await http.get(`${endpoint}/swap/v1/quote`, {
      params: params,
      headers: {
        "0x-api-key": import.meta.env.VITE_APP_0X_API_KEY,
      },
    });

    const { data, buyAmount, sellAmount, estimatedGas, price } = response.data;

    return {
      data: data,
      buyToken,
      sellToken,
      price,
      buyAmount: BigNumber.from(buyAmount),
      sellAmount: BigNumber.from(sellAmount),
      estimatedGas: BigNumber.from(estimatedGas),
      buyAmountWithSlippage: BigNumber.from(buyAmount)
        .mul(
          BigNumber.from(
            SLIPPAGE_ACCURACY - slippagePercentage * SLIPPAGE_ACCURACY
          )
        )
        .div(BigNumber.from(SLIPPAGE_ACCURACY)),
      sellAmountWithSlippage: BigNumber.from(sellAmount)
        .mul(
          BigNumber.from(
            SLIPPAGE_ACCURACY - slippagePercentage * SLIPPAGE_ACCURACY
          )
        )
        .div(BigNumber.from(SLIPPAGE_ACCURACY)),
    };
  } catch (error) {
    console.log("swap0xRequest error:", error);
    return error;
  }
};

export const swap0xRequestV2 = async (
  chainId,
  buyToken,
  sellToken,
  slippage = 0,
  amountSell = 0,
  takerAddress,
  amountBuy = 0
) => {
  try {
    const slippagePercentage = slippage / 100;

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

    const response = await http.get(
      `https://api.0x.org/swap/allowance-holder/quote`,
      {
        params: params,
        headers: {
          "0x-api-key": import.meta.env.VITE_APP_0X_API_KEY,
        },
      }
    );

    const { transaction, buyAmount, sellAmount } = response.data;

    return {
      data: transaction.data,
      buyToken,
      sellToken,
      buyAmount: BigNumber.from(buyAmount),
      sellAmount: BigNumber.from(sellAmount),
      buyAmountWithSlippage: BigNumber.from(buyAmount)
        .mul(
          BigNumber.from(
            SLIPPAGE_ACCURACY - slippagePercentage * SLIPPAGE_ACCURACY
          )
        )
        .div(BigNumber.from(SLIPPAGE_ACCURACY)),
      sellAmountWithSlippage: BigNumber.from(sellAmount)
        .mul(
          BigNumber.from(
            SLIPPAGE_ACCURACY - slippagePercentage * SLIPPAGE_ACCURACY
          )
        )
        .div(BigNumber.from(SLIPPAGE_ACCURACY)),
    };
  } catch (error) {
    console.log("swap0xRequest error:", error);
    return error;
  }
};
