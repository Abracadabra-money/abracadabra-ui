import type { Address } from "viem";
import { Wallet, providers } from "ethers";
import { parseUnits, hexToBigInt } from "viem";
import { formatAddress } from "@/helpers/filters";
import type { TopUpCauldron } from "@/types/tenderly";
import { MAX_ALLOWANCE_VALUE } from "@/constants/global";
import { getMimContract } from "@/helpers/tenderly/getMimContract";
import { sendTransaction } from "@/helpers/tenderly/sendTransaction";
import { getMinterAddress } from "@/helpers/tenderly/getMinterAddress";
import { getBentoBoxContract } from "@/helpers/cauldron/getBentoBoxContract";

export const topUpCauldron = async (
  amount: string,
  cauldronAddress: Address,
  chainId: number,
  provider: providers.BaseProvider,
  tokenDecimals = 18
): Promise<TopUpCauldron> => {
  try {
    const formattedAmount = parseUnits(amount, tokenDecimals);
    const bentoBoxContract: any = await getBentoBoxContract(
      cauldronAddress,
      provider
    );
    const fromAddress: any = await Wallet.createRandom().address;
    const mimContract: any = await getMimContract(chainId, provider);
    const minterAddress = await getMinterAddress(mimContract.address, chainId);

    await sendTransaction(
      mimContract,
      minterAddress,
      "mint",
      [fromAddress, formattedAmount],
      provider
    );

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
