import { formatUnits } from "ethers/lib/utils";

export const getMimCauldronBalance = async (bentoBox, cauldron, mim) => {
  try {
    const shares = await bentoBox.balanceOf(tokenAddr, cauldron);
    const amount = await bentoBox.toAmount(mim, shares, false);

    return formatUnits(amount);
  } catch (error) {
    console.log("getMimCauldronBalance error:", e);
  }
};

export const getBorrowlimit = async (cauldron) => {
  try {
    if (!cauldron.hasOwnProperty("borrowLimit")) return false;

    const borrowLimit = await poolContract.borrowLimit();

    return {
      borrowPartPerAddressLimit: formatUnits(borrowLimit.borrowPartPerAddress),
      totalLimit: formatUnits(borrowLimit.total),
    };
  } catch (error) {
    console.log("getBorrowlimit error:", e);
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
