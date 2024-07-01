import { swap0xRequest } from "@/helpers/0x";

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const fetchDelevStargateUSDT0xData = async (
  cauldronObject,
  collateralAmount,
  slipage
) => {
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selAmount = collateralAmount;
  const selToken = usdtAddress;

  const response = await swap0xRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper.address
  );
  return response.data;
};

export default fetchDelevStargateUSDT0xData;
