import type { Address } from "viem";
import bentoBoxAbi from "@/abis/bentoBox";
import whitelisterAbi from "@/abis/Whitelister";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getBentoBoxContract = async (
  chainId: number,
  address: Address | string,
  abi: any
) => {
  const publicClient = getPublicClient(chainId);

  const bentoBoxAddress = await publicClient.readContract({
    address: address,
    abi: abi,
    functionName: "bentoBox",
    args: [],
  });

  return {
    address: bentoBoxAddress,
    abi: bentoBoxAbi,
  };
};

export const getMasterContract = async (
  chainId: number,
  address: Address | string,
  abi: any
) => {
  const publicClient = getPublicClient(chainId);

  const masterContractAddress = await publicClient.readContract({
    address: address,
    abi: abi,
    functionName: "masterContract",
    args: [],
  });

  return {
    address: masterContractAddress,
    abi: null,
  };
};

export const getWhitelisterContract = async (
  chainId: number,
  address: Address | string,
  abi: any
) => {
  const publicClient = getPublicClient(chainId);

  const whitelisterAddress = await publicClient.readContract({
    address: address,
    abi: abi,
    functionName: "whitelister",
    args: [],
  });

  return {
    address: whitelisterAddress,
    abi: whitelisterAbi,
  };
};
