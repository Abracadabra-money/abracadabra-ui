import axios from "axios";
import { utils } from "ethers";
import type { Address } from "viem";
import { OPENOCEAN_BASE_URL } from "@/constants/global";

export const getOpenoceanData = async (
  tokenIn: Address,
  tokenOut: Address,
  amount: string,
  slippageBips: number,
  fromAccount: Address,
  isMimUsdtCurveLp: boolean,
  chainId = 2222
) => {
  const responseGasPrice = await axios.get(
    `${OPENOCEAN_BASE_URL}/${chainId}/gas-price`
  );
  const gasPrice = responseGasPrice.data.standard;

  const url = `${OPENOCEAN_BASE_URL}/${chainId}/swap?inTokenAddress=${tokenIn}&outTokenAddress=${tokenOut}&amount=${amount}&gasPrice=${gasPrice}&disabledDexIds=&slippage=${slippageBips}&account=${fromAccount}`;
  const response = await axios.get(url);

  return !isMimUsdtCurveLp
    ? response.data.data
    : utils.defaultAbiCoder.encode(
        ["address", "uint256", "bytes"],
        [tokenOut, "2", response.data.data]
      );
};
