const DECIMAL_CONVERSION_RATE = 1000000000000n;

export const removeDust = (_amountLD: bigint, decimalConversionRate = DECIMAL_CONVERSION_RATE): bigint => {
  return (_amountLD / decimalConversionRate) * decimalConversionRate;
}