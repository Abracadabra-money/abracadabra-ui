import { BigNumber } from "ethers";
import moment from "moment";

export type UserBorrowInfo = {
  userBorrowPart: BigNumber;
  userBorrowAmount: BigNumber;
};

export const getUserBorrowInfo = (
  userBorrowPart: BigNumber,
  totalBorrowInfo: any,
  accrueInfo: any
): UserBorrowInfo => {
  const BORROW_PRECISION = BigNumber.from(1e10);

  const { INTEREST_PER_SECOND, lastAccrued } = accrueInfo;

  if (totalBorrowInfo.elastic.isZero() || totalBorrowInfo.base.isZero()) {
    return {
      userBorrowPart,
      userBorrowAmount: userBorrowPart,
    };
  }

  const multiplier = totalBorrowInfo.elastic
    .mul(BORROW_PRECISION)
    .div(totalBorrowInfo.base);
  const userBorrowAmount = userBorrowPart.mul(multiplier).div(BORROW_PRECISION);

  if (!INTEREST_PER_SECOND || INTEREST_PER_SECOND.eq(0) || !lastAccrued) {
    return {
      userBorrowPart,
      userBorrowAmount,
    };
  }

  const duration = getSecondsSinceLastAccrue(lastAccrued);

  if (!duration)
    return {
      userBorrowPart,
      userBorrowAmount,
    };

  const accruedAmount = checkAccruedAmount(
    duration,
    userBorrowAmount,
    INTEREST_PER_SECOND
  );

  return {
    userBorrowPart,
    userBorrowAmount: userBorrowAmount.add(accruedAmount),
  };
};

const checkAccruedAmount = (
  duration: number,
  userBorrowAmount: BigNumber,
  INTEREST_PER_SECOND: BigNumber
): BigNumber => {
  const INTEREST_PRECISION = BigNumber.from("10000000000000000");
  const secondsInYear = BigNumber.from("316880878");

  const interestPercent =
    INTEREST_PER_SECOND.mul(secondsInYear).div(INTEREST_PRECISION);

  const mimPerSecond = userBorrowAmount
    .mul(interestPercent)
    .div(100)
    .div(secondsInYear)
    .div(INTEREST_PRECISION);

  const accruedAmount = mimPerSecond.mul(duration);

  return accruedAmount;
};

const getSecondsSinceLastAccrue = (lastAccrued: number): number => {
  const startTimestamp = moment.unix(lastAccrued);
  const currentTimestamp = moment.unix(new Date().getTime() / 1000);
  const duration = Math.floor(
    moment.duration(currentTimestamp.diff(startTimestamp)).asSeconds()
  );

  return duration;
};
