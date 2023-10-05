import { BigNumber, utils } from "ethers";
import { KAVA_USDT_ADDRESS } from "@/constants/tokensAddress";
import { fetchOpenocenSwapData } from "@/helpers/openocean/fetchOpenocenSwapData";

export const getOpenoceanDeleverageSwapData = async (
  cauldronConfig: any,
  amount: BigNumber,
  slipage: number
) => {
  const { mim } = cauldronConfig.contracts;
  const { address } = cauldronConfig.config.deleverageInfo;
  const { isMimUsdtCurveLp } = cauldronConfig.config.cauldronSettings;

  if (isMimUsdtCurveLp) {
    return utils.defaultAbiCoder.encode(["uint256", "bytes"], ["0", "0x"]);
  }

  const swapData = await fetchOpenocenSwapData(
    KAVA_USDT_ADDRESS,
    mim.address,
    amount.toString(),
    slipage,
    address,
    2222
  );

  return swapData;
};
