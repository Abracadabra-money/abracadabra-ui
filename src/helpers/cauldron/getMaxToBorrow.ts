import { utils, BigNumber } from "ethers";

const MIN_AMOUNT_TO_SHOW = 1000;

type BorrowLimit = {
  borrowPartPerAddress: BigNumber;
  total: BigNumber
}

export const getMaxToBorrow = async (
    mimCauldronBalance: string,
    borrowLimit: BorrowLimit,
    totalBorrowed: string,
    { localBorrowAmountLimit, isDepreciated }: { localBorrowAmountLimit: string | number, isDepreciated: boolean }
  ): Promise<number> => {
    if (localBorrowAmountLimit === 0 || isDepreciated) return 0;
  
    const values = [];
  
    values.push(+mimCauldronBalance);
  
    if (localBorrowAmountLimit) values.push(+localBorrowAmountLimit);
  
    if (borrowLimit) {
      values.push(+utils.formatUnits(borrowLimit.borrowPartPerAddress));
      values.push(+utils.formatUnits(borrowLimit.total));
  
      const availableLimit = +utils.formatUnits(borrowLimit.total) - +totalBorrowed;
      if (availableLimit < MIN_AMOUNT_TO_SHOW) return 0;
      values.push(availableLimit);
    }
  
    return Math.min(...values);
  };