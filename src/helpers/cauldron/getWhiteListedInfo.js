import { Contract, utils } from "ethers";
import whitelisterAbi from "@/utils/abi/Whitelister";
import yvcrvSTETHWhitelist from "@/utils/yvcrvSTETHWhitelist";

export const getWhiteListedInfo = async (
  config,
  contract,
  account,
  chainId,
  signer
) => {
  try {
    if (config.id !== 33 && chainId === 1) return null;
    const whitelisterAddress = await contract.whitelister();

    const whitelisterContract = new Contract(
      whitelisterAddress,
      JSON.stringify(whitelisterAbi),
      signer
    );

    const amountAllowed = await whitelisterContract.amountAllowed(account);

    let userWhitelistedInfo = null;

    const whitelist = yvcrvSTETHWhitelist;

    Object.keys(whitelist).forEach(function (key) {
      if (key.toLocaleLowerCase() === account.toLocaleLowerCase()) {
        userWhitelistedInfo = whitelist[key];
      }
    });

    if (!userWhitelistedInfo) return null;

    return {
      amountAllowedParsed: utils.formatUnits(amountAllowed),
      userBorrowPart: utils.formatUnits(userWhitelistedInfo.userBorrowPart),
      userWhitelistedInfo,
      whitelisterContract,
    };
  } catch (error) {
    console.log("Get White Listed Info Error", error);
    return null;
  }
};
