import { utils } from "ethers";
import type { BigNumber } from "ethers";

export const getTVL = async (
  stakingTokenTotalAmount: BigNumber,
  price: number
): Promise<Number | undefined> => {
  try {
    const ttl: string = utils.formatEther(stakingTokenTotalAmount.toString());

    return +ttl * price;
  } catch (error) {
    console.log(error);
  }
};
