export const getRoi = async (farmYield: any, price: any) => {
  try {
    return ((parseFloat(farmYield) * parseFloat(price) * 100) / 1000) * 365;
  } catch (error) {
    console.log("getRoi", error);
  }
};
