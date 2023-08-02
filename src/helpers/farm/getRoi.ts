export const getRoi = async (value: any, price: string) => {
  try {
    return ((parseFloat(value) * parseFloat(price) * 100) / 1000) * 365;
  } catch (error) {
    console.log("getRoi", error);
  }
};
