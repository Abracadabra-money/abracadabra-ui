import { BigNumber } from "ethers";
import moment from "moment";

export const getUserCollateralAmount = async (
  user,
  bentoBox,
  cauldron,
  collateral
) => {
  try {
    const userCollateralShare = await cauldron.userCollateralShare(user);

    const collateralAmount = await bentoBox.toAmount(
      collateral,
      userCollateralShare,
      false
    );

    return collateralAmount;
  } catch (error) {
    console.log("getUserCollateralAmount error:", error);
  }
};

export const getUserBorrowPart = async (cauldron, user) => {
  try {
    const userBorrowPart = await cauldron.userBorrowPart(user);

    const totalBorrowInfo = await cauldron.totalBorrow();

    if (totalBorrowInfo.elastic.isZero() || totalBorrowInfo.base.isZero()) {
      return userBorrowPart;
    }

    const multiplyer = totalBorrowInfo.elastic
      .mul(1e10)
      .div(totalBorrowInfo.base);
    const userBorrowFixed = userBorrowPart.mul(multiplyer).div(1e10);

    const { INTEREST_PER_SECOND, lastAccrued } = await cauldron.accrueInfo();

    if (!INTEREST_PER_SECOND || INTEREST_PER_SECOND.eq(0) || !lastAccrued) {
      return {
        contractBorrowPart: userBorrowPart,
        userBorrowPart: userBorrowFixed,
      };
    }

    const secondsInYear = BigNumber.from(31536000);
    const interestPercent = INTEREST_PER_SECOND.mul(secondsInYear).div(
      BigNumber.from("10000000000000000")
    );
    const mimPerSecond = userBorrowFixed
      .mul(interestPercent)
      .div(100)
      .div(secondsInYear)
      .div(BigNumber.from("10000000000000000"));

    const startTimestamp = moment.unix(lastAccrued);
    const currentTimestamp = moment.unix(new Date().getTime() / 1000);

    const duration = Math.floor(
      moment.duration(currentTimestamp.diff(startTimestamp)).asSeconds()
    );

    if (!duration) {
      return {
        contractBorrowPart: userBorrowPart,
        userBorrowPart: userBorrowFixed,
      };
    }

    const mimFromLastAccrue = mimPerSecond.mul(duration);

    return {
      contractBorrowPart: userBorrowPart,
      userBorrowPart: userBorrowFixed.add(mimFromLastAccrue),
    };
  } catch (error) {
    console.log("getUserBorrowPart error:", error);
  }
};

export const getLiquidationPrice = (
  userCollateralShare,
  userBorrowPart,
  mcr
) => {
  const liquidationPrice =
    userBorrowPart / userCollateralShare / (mcr / 100) || 0;

  return liquidationPrice;
};
