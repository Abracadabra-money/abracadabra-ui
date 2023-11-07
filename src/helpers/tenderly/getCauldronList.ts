import { formatUnits } from "viem";
import { multicall } from "@wagmi/core";
import lensAbi from "@/utils/abi/marketLens.js";
import cauldronsConfig from "@/utils/cauldronsConfig";
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

  const data = await multicall({
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
