import { utils } from "ethers";

export const getMimCauldronBalance = async (bentoBox, cauldron, mim) => {
  try {
    const shares = await bentoBox.balanceOf(mim, cauldron);
    const amount = await bentoBox.toAmount(mim, shares, false);

    return utils.formatUnits(amount);
  } catch (error) {
    console.log("getMimCauldronBalance error:", error);
  }
};

export const getBorrowlimit = async (cauldron) => {
  try {
    if (!Object.prototype.hasOwnProperty.call(cauldron, "borrowLimit")) return false;

    const borrowLimit = await cauldron.borrowLimit();

    return {
      borrowPartPerAddressLimit: utils.formatUnits(borrowLimit.borrowPartPerAddress),
      totalLimit: utils.formatUnits(borrowLimit.total),
    };
  } catch (error) {
    console.log("getBorrowlimit error:", error);
  }
};

export const getMIMsLeftToBorrow = async (
  mimCauldronBalance,
  borrowLimit,
  totalBorrowed,
  { localBorrowAmountLimit, isDepreciated }
) => {
  try {
    if (localBorrowAmountLimit === 0 || isDepreciated) return 0;

    const values = [];

    values.push(+mimCauldronBalance);

    if (localBorrowAmountLimit) values.push(+localBorrowAmountLimit);

    if (borrowLimit) {
      values.push(+borrowLimit.borrowPartPerAddressLimit);
      values.push(+borrowLimit.totalLimit);

      const availableLimit = +borrowLimit.totalLimit - +totalBorrowed;
      if (availableLimit < 1000) return 0;
      values.push(availableLimit);
    }

    return Math.min(...values);
  } catch (error) {
    console.log("getMIMsLeftToBorrow error:", error);
  }
};
