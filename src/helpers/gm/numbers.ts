import { BigNumber, type BigNumberish, ethers } from "ethers";
import { expandDecimals } from "./fee/expandDecials";

export const TRIGGER_PREFIX_ABOVE = ">";
export const TRIGGER_PREFIX_BELOW = "<";

const MAX_EXCEEDING_THRESHOLD = "1000000000";
const MIN_EXCEEDING_THRESHOLD = "0.01";

export const USD_DECIMALS = 30;

export function numberWithCommas(x: BigNumberish) {
  if (!x) {
    return "...";
  }

  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export const limitDecimals = (amount: BigNumberish, maxDecimals?: number) => {
  let amountStr = amount.toString();
  if (maxDecimals === undefined) {
    return amountStr;
  }
  if (maxDecimals === 0) {
    return amountStr.split(".")[0];
  }
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    let decimals = amountStr.length - dotIndex - 1;
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(
        0,
        amountStr.length - (decimals - maxDecimals)
      );
    }
  }

  return amountStr;
};

export const padDecimals = (amount: BigNumberish, minDecimals: number) => {
  let amountStr = amount.toString();
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1;
    if (decimals < minDecimals) {
      amountStr = amountStr.padEnd(
        amountStr.length + (minDecimals - decimals),
        "0"
      );
    }
  } else {
    amountStr = amountStr + ".0000";
  }
  return amountStr;
};

export const formatAmount = (
  amount: BigNumberish | undefined,
  tokenDecimals: number,
  displayDecimals?: number,
  useCommas?: boolean,
  defaultValue?: string
) => {
  if (!defaultValue) {
    defaultValue = "...";
  }
  if (amount === undefined || amount.toString().length === 0) {
    return defaultValue;
  }
  if (displayDecimals === undefined) {
    displayDecimals = 4;
  }
  let amountStr = ethers.utils.formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals);
  }
  if (useCommas) {
    return numberWithCommas(amountStr);
  }
  return amountStr;
};

function getLimitedDisplay(
  amount: BigNumber,
  tokenDecimals: number,
  opts: { maxThreshold?: string; minThreshold?: string } = {}
) {
  const {
    maxThreshold = MAX_EXCEEDING_THRESHOLD,
    minThreshold = MIN_EXCEEDING_THRESHOLD,
  } = opts;
  const max = expandDecimals(maxThreshold, tokenDecimals);
  const min = ethers.utils.parseUnits(minThreshold, tokenDecimals);
  const absAmount = amount.abs();

  if (absAmount.eq(0)) {
    return {
      symbol: "",
      value: absAmount,
    };
  }

  const symbol = absAmount.gt(max)
    ? TRIGGER_PREFIX_ABOVE
    : absAmount.lt(min)
    ? TRIGGER_PREFIX_BELOW
    : "";
  const value = absAmount.gt(max) ? max : absAmount.lt(min) ? min : absAmount;

  return {
    symbol,
    value,
  };
}

export function formatUsd(
  usd?: BigNumber,
  opts: {
    fallbackToZero?: boolean;
    displayDecimals?: number;
    maxThreshold?: string;
    minThreshold?: string;
  } = {}
) {
  const { fallbackToZero = false, displayDecimals = 2 } = opts;

  if (!usd) {
    if (fallbackToZero) {
      usd = BigNumber.from(0);
    } else {
      return undefined;
    }
  }

  const exceedingInfo = getLimitedDisplay(usd, USD_DECIMALS, opts);
  const sign = usd.lt(0) ? "-" : "";
  const displayUsd = formatAmount(
    exceedingInfo.value,
    USD_DECIMALS,
    displayDecimals,
    true
  );
  return `${exceedingInfo.symbol}${
    exceedingInfo.symbol ? " " : ""
  }${sign}$${displayUsd}`;
}

export function formatDeltaUsd(
  deltaUsd?: BigNumber,
  percentage?: BigNumber,
  opts: { fallbackToZero?: boolean; showPlusForZero?: boolean } = {}
) {
  if (!deltaUsd) {
    if (opts.fallbackToZero) {
      return `${formatUsd(BigNumber.from(0))} (${formatAmount(
        BigNumber.from(0),
        2,
        2
      )}%)`;
    }

    return undefined;
  }

  let sign = "";
  if (!deltaUsd.eq(0)) {
    sign = deltaUsd?.gt(0) ? "+" : "-";
  } else if (opts.showPlusForZero) {
    sign = "+";
  }
  const exceedingInfo = getLimitedDisplay(deltaUsd, USD_DECIMALS);
  const percentageStr = percentage
    ? ` (${sign}${formatPercentage(percentage.abs())})`
    : "";
  const deltaUsdStr = formatAmount(exceedingInfo.value, USD_DECIMALS, 2, true);

  return `${exceedingInfo.symbol} ${sign}$${deltaUsdStr}${percentageStr}`;
}

export function formatPercentage(
  percentage?: BigNumber,
  opts: { fallbackToZero?: boolean; signed?: boolean } = {}
) {
  const { fallbackToZero = false, signed = false } = opts;

  if (!percentage) {
    if (fallbackToZero) {
      return `${formatAmount(BigNumber.from(0), 2, 2)}%`;
    }

    return undefined;
  }

  let sign = "";

  if (signed && !percentage.eq(0)) {
    sign = percentage?.gt(0) ? "+" : "-";
  }

  return `${sign}${formatAmount(percentage.abs(), 2, 2)}%`;
}
