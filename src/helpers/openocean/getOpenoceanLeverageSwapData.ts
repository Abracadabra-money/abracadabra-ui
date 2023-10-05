import { utils } from "ethers";
import { KAVA_USDT_ADDRESS } from "@/constants/tokensAddress";
import { fetchOpenocenSwapData } from "@/helpers/openocean/fetchOpenocenSwapData";

export const getOpenoceanLeverageSwapData = async (
  cauldronConfig: any,
  amount: string,
  slipage: number
) => {
  const { isMimUsdtCurveLp } = cauldronConfig.config.cauldronSettings;
  const { address } = cauldronConfig.config.leverageInfo;
  const { mim } = cauldronConfig.contracts;

  if (isMimUsdtCurveLp) {
    return utils.defaultAbiCoder.encode(
      ["address", "uint256", "bytes"],
      [mim.address, "0", "0x"]
    );
  }

  const swapData = await fetchOpenocenSwapData(
    mim.address,
    KAVA_USDT_ADDRESS,
    amount,
    slipage,
    address,
    2222
  );

  return swapData;
};
