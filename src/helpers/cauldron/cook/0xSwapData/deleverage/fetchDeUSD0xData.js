import { utils } from "ethers";
import { swap0xRequestV2 } from "@/helpers/0x";
const getDeUsd0xData = async (cauldronObject, collateralAmount, slipage) => {
  const { mim, liquidationSwapper, collateral } = cauldronObject.contracts;

  const response = await swap0xRequestV2(
    cauldronObject.config.chainId,
    mim.address,
    collateral.address,
    slipage,
    collateralAmount,
    liquidationSwapper.address
  );

  return utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    [response.to, response.data]
  );
};

export default getDeUsd0xData;
