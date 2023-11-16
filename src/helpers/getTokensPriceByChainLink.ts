import { formatUnits } from "viem";
import { readContracts } from "@wagmi/core";
import chainLinkAbi from "@/utils/abi/chainLink";

export const getTokensPriceByChainLink = async (
  adresses: string[],
  format = true
) => {
  const contracts: any = adresses.map((address) => {
    return {
      address,
      abi: chainLinkAbi,
      functionName: "latestAnswer",
    };
  });

  const response = await readContracts({
    contracts,
  });

  if (format) return response.map(({ result }: any) => +formatUnits(result, 8));
  return response;
};
