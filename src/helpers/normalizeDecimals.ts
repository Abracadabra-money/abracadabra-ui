export const normalizeDecimals = (
  amount: bigint,
  fromDecimals: number,
  toDecimals: number
) => {
  return fromDecimals < toDecimals
    ? amount * 10n ** BigInt(toDecimals - fromDecimals)
    : amount / 10n ** BigInt(fromDecimals - toDecimals);
};
