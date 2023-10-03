import axios from "axios";
import type { Address } from "viem";
import { OPENOCEAN_BASE_URL } from "@/constants/global";

export const fetchOpenocenSwapData = async (
  tokenIn: Address | string,
  tokenOut: Address | string,
  amount: string,
  slippageBips: number,
  fromAccount: Address,
  chainId = 2222
) => {
  const responseGasPrice = await axios.get(
    `${OPENOCEAN_BASE_URL}/${chainId}/gas-price`
  );
  const gasPrice = responseGasPrice.data.standard;
  const url = `${OPENOCEAN_BASE_URL}/${chainId}/swap?inTokenAddress=${tokenIn}&outTokenAddress=${tokenOut}&amount=${amount}&gasPrice=${gasPrice}&disabledDexIds=&slippage=${slippageBips}&account=${fromAccount}`;
  const response = await axios.get(url);
  return response.data.data;
};
