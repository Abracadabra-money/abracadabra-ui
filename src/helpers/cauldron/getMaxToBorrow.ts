import { utils } from "ethers";

export const getMaxToBorrow = async (
    mimCauldronBalance: string,
    borrowLimit: any,
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
      if (availableLimit < 1000) return 0;
      values.push(availableLimit);
    }
  
    return Math.min(...values);
  };