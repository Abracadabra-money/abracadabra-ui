import { ethers, providers } from "ethers";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";
import { MIM_CHAIN_LINK } from "@/constants/chainlink";
import { MAINET_RPC } from "@/constants/rpc";

export const getMimPrice = async (): Promise<String> => {
  const defaultProvider = new providers.StaticJsonRpcProvider(MAINET_RPC);

  const contract = await new ethers.Contract(
    MIM_CHAIN_LINK,
    JSON.stringify(priceAbi),
    defaultProvider
  );

  const price = await contract.latestAnswer();
  return ethers.utils.formatUnits(price.toString(), 8);
};
