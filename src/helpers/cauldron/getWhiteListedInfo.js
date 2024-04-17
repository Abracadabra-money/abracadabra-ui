import { formatUnits } from "viem";
import { getWhitelisterContract } from "@/helpers/publicClientHelper";
import yvcrvSTETHWhitelist from "@/configs/whitelists/yvcrvSTETHWhitelist";

const userNotWhitelisted = { isUserWhitelisted: false };

export const getWhiteListedInfo = async (
  config,
  chainId,
  publicClient,
  account
) => {
  try {
    if (config.id !== 33 || chainId !== 1) return null;

    const whitelisterContract = await getWhitelisterContract(
      chainId,
      config.contract.address,
      config.contract.abi
    );

    const amountAllowed = await publicClient.readContract({
      address: whitelisterContract.address,
      abi: whitelisterContract.abi,
      functionName: "amountAllowed",
      args: [account],
    });

    const whitelist = yvcrvSTETHWhitelist;

    let userWhitelistedInfo = null;
    Object.keys(whitelist).forEach(function (key) {
      if (key.toLocaleLowerCase() === account.toLocaleLowerCase()) {
        userWhitelistedInfo = whitelist[key];
      }
    });

    if (!userWhitelistedInfo) return userNotWhitelisted;

    return {
      amountAllowedParsed: formatUnits(amountAllowed),
      userBorrowPart: formatUnits(userWhitelistedInfo.userBorrowPart, 18),
      userWhitelistedInfo,
      contract: whitelisterContract,
    };
  } catch (error) {
    console.log("Get White Listed Info Error", error);
    return userNotWhitelisted;
  }
};
