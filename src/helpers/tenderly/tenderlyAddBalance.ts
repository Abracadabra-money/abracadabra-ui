import { toHex } from "viem";
import { parseEther } from "viem";
import type { Address } from "viem";

export const tenderlyAddBalance = async (
  address: Address,
  gas: number,
  provider: any
) => {
  try {
    const formattedAmount = parseEther(gas.toString());
    const params = [[address], toHex(formattedAmount)];
    await provider.send("tenderly_addBalance", params);
    return "success";
  } catch (error) {
    console.log("Tenderly Add Balance Error", error);
    return "error";
  }
};
