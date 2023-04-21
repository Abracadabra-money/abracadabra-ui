import { Contract, utils } from "ethers";

export const getMimCauldronBalance = async (bentoBox: Contract, cauldron: string, mim: string): Promise<string> => {
  const shares = await bentoBox.balanceOf(mim, cauldron);
  const amount = await bentoBox.toAmount(mim, shares, false);

  return utils.formatUnits(amount);
};

export const getBorrowlimit = async (cauldron: Contract): Promise<boolean | object> => {
  if (!Object.prototype.hasOwnProperty.call(cauldron, "borrowLimit")) return false;

  const borrowLimit = await cauldron.borrowLimit();

  return {
    borrowPartPerAddressLimit: utils.formatUnits(borrowLimit.borrowPartPerAddress),
    totalLimit: utils.formatUnits(borrowLimit.total),
  };
};

export const getMIMsLeftToBorrow = async (
  cauldron: Contract,
  bentoBox: Contract,
  mim: string,
  totalBorrowed: string,
  { localBorrowAmountLimit, isDepreciated }: { localBorrowAmountLimit: string | number, isDepreciated: boolean }
): Promise<number> => {
  if (localBorrowAmountLimit === 0 || isDepreciated) return 0;

  const mimCauldronBalance: string = await getMimCauldronBalance(bentoBox, cauldron.address, mim);
  const borrowLimit: any = await getBorrowlimit(cauldron);

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
};
