import { parseUnits, type Address } from "viem";
import { ethers, providers, utils } from "ethers";
import { getRpcByChainId } from "@/helpers/chains";
import { getGasPrice } from "@/helpers/gm/fee/getGasPrice";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { estimateFeesPerGasHelper } from "@/helpers/walletClienHelper";

export const getTransactionFee = async (
  chainId: number,
  method: string,
  payload: Array<string | bigint | number>,
  sender: Address
): Promise<bigint> => {
  if (!payload.length) return 0n;

  try {
    const rpc: string = getRpcByChainId(chainId);
    const provider: providers.JsonRpcProvider =
      new ethers.providers.JsonRpcProvider(rpc);
    const swapRouterAddress: Address = getSwapRouterByChain(chainId);

    const swapRouterContract = new ethers.Contract(
      swapRouterAddress,
      BlastMIMSwapRouterAbi,
      provider
    );

    const estimateGas = await swapRouterContract.estimateGas[method](
      ...payload,
      {
        from: sender,
      }
    );

    const gasPrice = await getGasPrice(provider);

    const feeData = await estimateFeesPerGasHelper();

    // console.log("feeData", feeData);

    return parseUnits(utils.formatUnits(estimateGas.mul(gasPrice)), 18);
  } catch (error) {
    console.log("getTransactionFee error");
    return 0n;
  }
};
