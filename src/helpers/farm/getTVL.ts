import { utils } from "ethers";
import type { BigNumber } from "ethers";

export const getTVL = async (
  stakingTokenTotalAmount: BigNumber,
  price: number
): Promise<number> => {
  try {
    const ttl: number = Number(
      utils.formatEther(stakingTokenTotalAmount.toString())
    );

    return ttl * price;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
