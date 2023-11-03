import { utils } from "ethers";
import { holdersConfig } from "@/utils/tenderly/holdersConfig";
import { erc20ABI, type Address, multicall } from "@wagmi/core";

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
      abi: erc20ABI,
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
