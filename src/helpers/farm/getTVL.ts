import { formatUnits } from "viem";

export const getTVL = async (
  stakingTokenTotalAmount: bigint,
  price: number
): Promise<number> => {
  try {
    const tvl: number = Number(formatUnits(stakingTokenTotalAmount, 18));

    return tvl * price;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
