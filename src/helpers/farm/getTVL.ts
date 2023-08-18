import { utils } from "ethers";
import type { BigNumber } from "ethers";

export const getTVL = async (
  stakingTokenTotalAmount: BigNumber,
  price: number
): Promise<number> => {
  try {
    const tvl: number = Number(
      utils.formatEther(stakingTokenTotalAmount)
    );

    return tvl * price;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
