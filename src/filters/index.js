const isValidNumber = (num) => !isNaN(num) && num !== 0;

const customToFixed = (value, fixed = 2) => {
  let [beforePoint, afterPoint = ""] = value.split(".");
  afterPoint = afterPoint.slice(0, fixed);

  if (afterPoint) {
    afterPoint = afterPoint.padEnd(fixed, "0");
  }

  return `${beforePoint}${afterPoint ? `.${afterPoint}` : ""}`;
};

const formatAfterPoint = (num, maxFixed = 4) => {
  if (num >= 1) {
    const numArray = customToFixed(num.toString()).split(".");
    numArray[0] = numArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numArray.join(".");
  }

  const fixedMinNum = customToFixed(num.toString());
  const parsedNum = Number(customToFixed(num.toString(), maxFixed)).toString();
  return fixedMinNum.length > parsedNum.length ? fixedMinNum : parsedNum;
};

const filters = {
  usdFormat: function (value) {
    let resString = "0.0";
    const num = Number(value);
    if (isValidNumber(num) && num >= 0.0001) {
      resString = formatAfterPoint(num);
    }
    return `$ ${resString}`;
  },
  tokenBalanceFormat: function (value) {
    let resString = "0.0";
    const num = Number(value);
    if (isValidNumber(num)) {
      const numArray = String(value).split(".");
      if (numArray[1] && numArray[1].slice(0, 6) === "000000") {
        let startPos = 0;
        for (const char of numArray[1]) {
          if (char !== "0") break;
          startPos++;
        }
        resString = `${numArray[0]}.0...${numArray[1].slice(
          startPos,
          startPos + 5
        )}`;
      } else {
        resString = formatAfterPoint(num, 6);
      }
    }
    return resString;
  },
  largeSumFormat: function (value) {
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
  },
  appToFixed: function (value, fixed) {
    return customToFixed(String(value), fixed);
  },
};

export default filters;
