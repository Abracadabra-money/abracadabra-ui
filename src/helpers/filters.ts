export const formatUSD = (value: string | number) => {
  if (isNaN(Number(value)) || +value === 0) return "$ 0.0";

  let decimals = +value < 1 ? 4 : 2;

  if (+value < 0.0001) decimals = 6;

  const formatAmount = +parseFloat(String(value)).toFixed(decimals);

  if (+value < 0.01) return `< $0.01`;

  return `$ ${formatAmount.toLocaleString("en-US", { currency: "USD" })}`;
};

export const formatPercent = (value: string | number) => {
  if (isNaN(Number(value)) || +value === 0 || +value < 0.0001) return "0.0%";
  const decimals = +value < 1 ? 4 : 2;
  const formatAmount = +parseFloat(String(value)).toFixed(decimals);
  return `${formatAmount}%`;
};

export const formatLargeSum = (value: string | number): string => {
  if (isNaN(Number(value))) return "0";
  if (Number(value) < 1) return formatToFixed(value, 2);

  const lookup = [
    { value: 0, symbol: "" },
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  // Round the value to the nearest integer
  let roundedValue = roundToNearestTenIfBigger(value);

  const item = lookup.reverse().find((item) => roundedValue >= item.value);

  if (!item) return "0";
  return `${(roundedValue / item.value).toFixed(2).replace(rx, "$1")}${
    item.symbol
  }`;
};

export const roundToNearestTenIfBigger = (value: string | number): number => {
  const num = Number(value);
  if (isNaN(num)) return 0;

  if (num <= 10) return num;

  // Round to the nearest multiple of 10
  return Math.round(num / 10) * 10;
};

export const formatToFixed = (value: string | number, fixed: number) => {
  if (isNaN(Number(value))) return "0";

  const itsNumber = typeof value === "number";
  const maxFixedValue = itsNumber
    ? parseFloat(String(value)).toFixed(20)
    : value;

  // eslint-disable-next-line no-useless-escape
  const re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);

  const match = maxFixedValue.match(re);
  const parsedValue = match ? match[0] : "";

  if (+parsedValue === 0) return "0";

  if (checkIfInteger(parsedValue)) return parseFloat(parsedValue).toFixed(1);

  const removedZero = parsedValue.replace(/0*$/, "");
  const removedDot = removedZero.endsWith(".")
    ? removedZero.slice(0, -1)
    : removedZero;

  return removedDot;
};

export const formatTokenBalance = (value: string | number) => {
  if (isNaN(Number(value)) || +value === 0) return "0.0";

  if (+value >= 1)
    return (+formatToFixed(value, 4)).toLocaleString("en-US", {
      currency: "USD",
    });

  if (+value > 0.001)
    return (+formatToFixed(value, 4)).toLocaleString("en-US", {
      currency: "USD",
    });

  if (+value > 0.000001) return +formatToFixed(value, 6);

  return `<0.01`;
};

export const formatExactPrice = (value: string | number) => {
  return `$ ${formatTokenBalance(value)}`;
};

export const formatAddress = (address: string) => {
  return (
    address.substring(0, 5) +
    "..." +
    address.substring(address.length - 5, address.length)
  );
};

const checkIfInteger = (value: string) => {
  const splitedByDot = value.split(".");

  if (splitedByDot.length < 2) return true;

  const numberAfterDot = Number(splitedByDot[1]);

  return numberAfterDot > 0 ? false : true;
};
