export const getRoi = async (
  farmYield: number,
  price: number
): Promise<number> => {
  try {
    return Number(((farmYield * price * 100) / 1000) * 365);
  } catch (error) {
    console.log("getRoi", error);
    return 0;
  }
};
