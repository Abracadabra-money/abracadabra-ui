import moment from "moment";
import type { Contract } from "ethers";

export const checkIsUserCollateralLocked = async (
  config: any,
  contract: Contract,
  account: string | undefined,
  chainId: number
): Promise<any> => {
  try {
    const { id } = config;
    if (id !== 11 || (id !== 22 && chainId === 1)) return false;

    const { lockedUntil } = await contract.users(account);
    const lockTimestamp = lockedUntil.toString();
    const currentTimestamp = moment().unix().toString();

    if (lockTimestamp && lockTimestamp > currentTimestamp) return lockTimestamp;
    return false;
  } catch (error) {
    console.log("Check Is User Collateral Locked Error:", error);
    return false;
  }
};
