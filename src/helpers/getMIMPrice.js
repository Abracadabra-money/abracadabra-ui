import { providers, Contract, utils } from "ethers";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";

export const getMIMPrice = async () => {
  const defaultProvider = new providers.StaticJsonRpcProvider(
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );

  const oracle = new Contract(
    "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
    JSON.stringify(priceAbi),
    defaultProvider
  );

  const price = await oracle.latestAnswer();

  return utils.formatUnits(price.toString(), 8);
};
