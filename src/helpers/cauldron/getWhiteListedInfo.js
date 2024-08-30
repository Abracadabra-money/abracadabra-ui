import { formatUnits } from "viem";
import whitelisterAbi from "@/abis/Whitelister";
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

    const whitelisterAddress = await publicClient.readContract({
      address: config.contract.address,
      abi: config.contract.abi,
      functionName: "whitelister",
      args: [],
    });

    const amountAllowed = await publicClient.readContract({
      address: whitelisterAddress,
      abi: whitelisterAbi,
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
      amountAllowedParsed: formatUnits(
        amountAllowed,
        config.collateralInfo.decimals
      ),
      userBorrowPart: formatUnits(userWhitelistedInfo.userBorrowPart, 18),
      userWhitelistedInfo,
      contract: {
        address: whitelisterAddress,
        abi: whitelisterAbi,
      },
    };
  } catch (error) {
    console.log("Get White Listed Info Error", error);
    return userNotWhitelisted;
  }
};
