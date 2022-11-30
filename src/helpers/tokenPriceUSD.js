import { ethers } from "ethers";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";
import store from "@/store";

const mimPrice = async () => {
  const signer = store.getters.getSigner;

  const mimChainLinkContract = await new ethers.Contract(
    "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
    JSON.stringify(priceAbi),
    signer
  );

  return await mimChainLinkContract.latestAnswer();
};

export { tokenPriceUSD, mimPrice };
