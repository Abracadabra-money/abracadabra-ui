import { Contract, utils, providers } from "ethers";

export const getUserBalance = async (
  contract: Contract,
  account: string,
  decimals: number,
  isBigNumber?: boolean
) => {
  try {
    const balance = await contract.balanceOf(account);
    if (isBigNumber) return balance;
    return utils.formatUnits(balance, decimals);
  } catch (error) {
    console.log("Get User Ballance Error:", error);
  }
};

export const getNativeTokenBalance = async (
  provider: providers.BaseProvider,
  account: string,
  decimals: number,
  isBigNumber?: boolean
) => {
  try {
    const balance = await provider.getBalance(account);
    if (isBigNumber) return balance;
    return utils.formatUnits(balance, decimals);
  } catch (error) {
    console.log("Get User Ballance Error:", error);
  }
};
