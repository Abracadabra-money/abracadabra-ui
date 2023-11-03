const formatUSD = (value) => {
  if (isNaN(Number(value)) || +value === 0) return "$ 0.0";

  let decimals = +value < 1 ? 4 : 2;

  if (+value < 0.0001) decimals = 6;

  const formatAmount = +parseFloat(value).toFixed(decimals);

  if (+value < 0.01) return `$ <0.01`;

  return `$ ${formatAmount.toLocaleString("en-US", { currency: "USD" })}`;
};

const formatNumber = (value) => {
  if (isNaN(Number(value)) || +value === 0 || +value < 0.0001) return "$ 0.0";
  const decimals = +value < 1 ? 4 : 2;

  const formatAmount = +parseFloat(value).toFixed(decimals);

  return formatAmount.toLocaleString("en-US", { currency: "USD" });
};

const formatPercent = (value) => {
  if (isNaN(Number(value)) || +value === 0 || +value < 0.0001) return "0.0%";
  const decimals = +value < 1 ? 4 : 2;

  const formatAmount = +parseFloat(value).toFixed(decimals);

  return `${formatAmount}%`;
};

const formatLargeSum = (value) => {
  if (isNaN(Number(value)) || Number(value) < 1) return "0";

  const lookup = [
    { value: 0, symbol: "" },
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let item = lookup.reverse().find((item) => parseFloat(value) >= item.value);
  return `${(parseFloat(value) / item.value).toFixed(2).replace(rx, "$1")}${
    item.symbol
  }`;
};

const formatToFixed = (value, fixed) => {
  if (isNaN(Number(value))) return "0";

  const itsNumber = typeof value === "number";
  const maxFixedValue = itsNumber ? parseFloat(value).toFixed(20) : value;
  //eslint-disable-next-line no-useless-escape
  let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);

  const parsedValue = maxFixedValue.match(re)[0];

  if (+parsedValue === 0) return "0";

  if (Number.isInteger(+parsedValue)) return parseFloat(parsedValue).toFixed(1);

  const removedZero = parsedValue.replace(/0*$/, "");
  const removedDot = removedZero.endsWith(".")
    ? removedZero.slice(0, -1)
    : removedZero;
  return removedDot;
};

const formatTokenBalance = (value) => {
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

  const stringValue = formatToFixed(value, 18);

  const start = stringValue.slice(0, 1);
  const endToParse = `${stringValue.slice(1)}`;

  const persedEnd = endToParse.replace(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      `(?<=\.)[0]*`
    ),
    ""
  );

  return `${start}..${persedEnd.slice(0, 5)}`;
};

const formatExactPrice = (value) => {
  return `$ ${formatTokenBalance(value)}`;
};

const formatAddress = (address) => {
  return (
    address.substring(0, 5) +
    "..." +
    address.substring(address.length - 5, address.length)
  );
};

const filters = {
  formatUSD,
  formatNumber,
  formatTokenBalance,
  formatLargeSum,
  formatToFixed,
  formatPercent,
  formatExactPrice,
  formatAddress,
};

export default filters;
