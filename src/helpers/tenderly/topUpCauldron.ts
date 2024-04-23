import type { Address } from "viem";
import bentoBoxAbi from "@/abis/bentoBox";
import cauldronAbi from "@/abis/cauldronAbi";
import { parseUnits, hexToBigInt } from "viem";
import { formatAddress } from "@/helpers/filters";
import { Contract, type providers } from "ethers";
import type { TopUpCauldron } from "@/types/tenderly";
import { MAX_ALLOWANCE_VALUE } from "@/constants/global";
import { getAccountHelper } from "@/helpers/walletClienHelper";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getMimContract } from "@/helpers/tenderly/getMimContract";
import { sendTransaction } from "@/helpers/tenderly/sendTransaction";

export const topUpCauldron = async (
  amount: string,
  cauldronAddress: Address,
  chainId: number,
  provider: providers.BaseProvider,
  tokenDecimals = 18
): Promise<TopUpCauldron> => {
  try {
    const publicClient = getPublicClient(chainId);
    const formattedAmount = parseUnits(amount, tokenDecimals);

    const bentoBoxAddress: any = await publicClient.readContract({
      address: cauldronAddress,
      abi: cauldronAbi,
      functionName: "bentoBox",
    });

    const bentoBoxContract = new Contract(
      bentoBoxAddress,
      bentoBoxAbi,
      provider
    );

    const { address } = await getAccountHelper();

    const fromAddress: any = address;
    const mimContract: any = await getMimContract(chainId, provider);

    await sendTransaction(
      mimContract,
      fromAddress,
      "approve",
      [bentoBoxContract.address, hexToBigInt(MAX_ALLOWANCE_VALUE)],
      provider
    );

    const txHash = await sendTransaction(
      bentoBoxContract,
      fromAddress,
      "deposit",
      [
        mimContract.address, // token address,
        fromAddress, // from address,
        cauldronAddress, // to address,
        formattedAmount.toString(), // amount,
        formattedAmount.toString(), // share
      ],
      provider
    );

    return {
      status: "success",
      txHash: txHash,
      msg: `Success!Sent ${amount} gas tokens to ${formatAddress(
        cauldronAddress
      )}`,
    };
  } catch (error) {
    console.log("Top Up Cauldron Error", error);
    return {
      status: "error",
      txHash: null,
      msg: "Transaction encountered an Error",
    };
  }
};
