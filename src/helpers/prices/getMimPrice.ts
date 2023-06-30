import { ethers, providers } from "ethers";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";

const MIM_CHAIN_LINK: string = "0x7A364e8770418566e3eb2001A96116E6138Eb32F";
const MAINET_RPC: string =
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

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
