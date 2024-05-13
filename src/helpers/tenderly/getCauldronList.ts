import { formatUnits } from "viem";
import lensAbi from "@/abis/marketLens.js";
import cauldronsConfig from "@/configs/cauldrons";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";

export const getCauldronList = async (chainId: number) => {
  const lensContract = {
    address: getLensAddress(chainId),
    abi: lensAbi,
  };

  const configs: any[] = cauldronsConfig.filter(
    (config) => config.chainId === chainId
  );

  const multicallArr: any = configs.map(({ contract }) => {
    return {
      ...lensContract,
      functionName: "getInterestPerYear",
      args: [contract.address],
    };
  });

  const publicClient = getPublicClient(chainId);

  const data = await publicClient.multicall({
    contracts: multicallArr,
  });

  return configs.map((config, index) => {
    const interest: any = data[index].result;

    return {
      id: config.id,
      icon: config.icon,
      name: config.name,
      address: config.contract.address,
      interest: interest ? formatUnits(interest / 100n, 0) : config.interest,
    };
  });
};
