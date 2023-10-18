import type { PublicClient } from "viem";
import { Contract, providers } from "ethers";
import { formatUnits, type Address } from "viem";
import whitelist from "@/utils/yvcrvSTETHWhitelist";
import whitelisterAbi from "@/utils/abi/Whitelister";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

const userNotWhitelisted = { isUserWhitelisted: false };

export const getWhiteListedInfoViem = async (
  config: CauldronConfig,
  chainId: number,
  account: Address | undefined,
  publicClient: PublicClient,
  contractProvider: providers.BaseProvider | providers.JsonRpcSigner
) => {
  try {
    if (config.id !== 33 || chainId !== 1) return null;
    const { contract, collateralInfo } = config;
    const { decimals } = collateralInfo;

    const whitelisterAddress: any = await publicClient.readContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "whitelister",
      args: [],
    });

    const amountAllowed: any = await publicClient.readContract({
      address: whitelisterAddress,
      abi: whitelisterAbi,
      functionName: "amountAllowed",
      args: [account],
    });

    const whitelisterContract = new Contract(
      whitelisterAddress,
      JSON.stringify(whitelisterAbi),
      contractProvider
    );

    let userWhitelistedInfo: any = null;

    Object.keys(whitelist).forEach((key) => {
      if (key.toLocaleLowerCase() === account!.toLocaleLowerCase()) {
        userWhitelistedInfo = whitelist[key as keyof typeof whitelist];
      }
    });

    if (!userWhitelistedInfo) return userNotWhitelisted;

    return {
      amountAllowedParsed: formatUnits(amountAllowed, decimals),
      userBorrowPart: formatUnits(userWhitelistedInfo.userBorrowPart, decimals),
      userWhitelistedInfo,
      whitelisterContract,
    };
  } catch (error) {
    console.log("Get White Listed Info Error", error);
    return userNotWhitelisted;
  }
};
