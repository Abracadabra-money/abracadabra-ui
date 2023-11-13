export const getGasPrice = async (provider) => {
  const defaultBufferBps = 1000;
  const BASIS_POINTS_DIVISOR = 10000;
  let gasPrice = await provider.getGasPrice();

  const buffer = gasPrice.mul(defaultBufferBps).div(BASIS_POINTS_DIVISOR);
  gasPrice = gasPrice.add(buffer);

  return gasPrice;
};
