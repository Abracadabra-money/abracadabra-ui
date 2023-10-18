import moment from "moment";
import { readContract, type Address } from "@wagmi/core";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

export const checkIsUserCollateralLockedViem = async (
  config: CauldronConfig,
  account: Address,
  chainId: number
) => {
  try {
    const { isSSpell } = config.cauldronSettings;
    if (chainId !== 1 || !isSSpell) return false;

    const [balance, lockedUntil]: any = await readContract({
      address: config.collateralInfo.address,
      abi: config.collateralInfo.abi,
      functionName: "users",
      args: [account],
    });

    const lockTimestamp = lockedUntil.toString();
    const currentTimestamp = moment().unix().toString();

    if (lockTimestamp && lockTimestamp > currentTimestamp) return lockTimestamp;
    return false;
  } catch (error) {
    console.log("Check Is User Collateral Locked Error:", error);
    return false;
  }
};
