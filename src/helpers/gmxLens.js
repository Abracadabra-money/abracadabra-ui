import { Contract } from "ethers";

const gmxLensAddress = "0xF6939A5D9081799041294B05f1939A06A0AdB75c";
import gmxLensAbi from "@/utils/abi/lp/GmxLens";

export const getGlpTokenOutAmount = async (collateralToken, amountFrom, tokenOut, provider) => {
  const GmxLensContract = new Contract(
    gmxLensAddress,
    JSON.stringify(gmxLensAbi),
    provider
  );

  const glpAmount = await collateralToken.contract.convertToAssets(amountFrom);

  return await GmxLensContract.getTokenOutFromBurningGlp(
    tokenOut,
    glpAmount
  );
};