import { swapOdosRequest } from "@/helpers/odos";
import { utils } from "ethers";

const fetchUSD0ppOdosData = async (
  cauldronObject,
  collateralAmount,
  slipage
) => {
  const { collateral, liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = cauldronObject.config.wrapInfo.unwrappedToken.address;
  const selAmount = await collateral.convertToAssets(collateralAmount);

  const swapResponse = await swapOdosRequest(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper.address
  );

  return utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    [swapResponse.to, swapResponse.data]
  );
};

export default fetchUSD0ppOdosData;
