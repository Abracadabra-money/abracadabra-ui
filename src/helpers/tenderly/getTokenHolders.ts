import { utils } from "ethers";
import { multicall } from "@wagmi/core";
import { erc20Abi, type Address } from "viem";
import { holdersConfig } from "@/configs/tenderly/holdersConfig";

export const getTokenHolders = async (
  chainId: number,
  tokenAddress: Address,
  holdersAddresses = ""
) => {
  const parseHoldersAddresses = holdersAddresses.trim().split(",");

  const holders = [
    ...parseHoldersAddresses,
    ...holdersConfig[chainId as keyof typeof holdersConfig],
  ].filter((address) => utils.isAddress(address.toLowerCase()));

  const multicallArray = holders.map((address) => {
    return {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    };
  });

  const multicallData: any = await multicall({
    contracts: multicallArray,
  });

  return multicallData
    .map(({ result }: any, index: number) => {
      return {
        address: holders[index],
        amount: result,
      };
    })
    .filter((item: any) => item.amount);
};
