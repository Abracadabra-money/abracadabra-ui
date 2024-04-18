import moment from "moment";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const checkIsUserCollateralLocked = async (
  config: any,
  chainId: number,
  account: string | undefined
): Promise<any> => {
  try {
    const { isSSpell } = config.cauldronSettings;

    if (chainId !== 1 || !isSSpell) return false;

    const publicClient = getPublicClient(chainId);

    const [lockAmount, timestamp] = await publicClient.readContract({
      address: config.collateralInfo.address,
      abi: config.collateralInfo.abi,
      functionName: "users",
      args: [account],
    });

    const lockTimestamp = timestamp.toString();
    const currentTimestamp = moment().unix().toString();

    if (lockTimestamp && lockTimestamp > currentTimestamp) return lockTimestamp;
    return false;
  } catch (error) {
    console.log("Check Is User Collateral Locked Error:", error);
    return false;
  }
};
