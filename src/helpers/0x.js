import { BigNumber } from "ethers";
import axios from "axios";

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
  amountSell,
  takerAddress
) => {
  try {
    const slippagePercentage = slippage / 100;

    const endpoint = endpoints[chainId];

    const params = {
      buyToken: buyToken,
      sellToken: sellToken,
      sellAmount: amountSell.toString(),
      slippagePercentage,
      skipValidation: true,
      takerAddress,
    };

    const response = await axios.get(`${endpoint}/swap/v1/quote`, {
      params: params,
    });

    const { data, buyAmount, sellAmount, estimatedGas, price } = response.data;

    return {
      data: data,
      price,
      buyAmount: BigNumber.from(buyAmount),
      sellAmount: BigNumber.from(sellAmount),
      estimatedGas: BigNumber.from(estimatedGas),
    };
  } catch (error) {
    console.log("swap0xRequest error:", error);
    return error;
  }
};