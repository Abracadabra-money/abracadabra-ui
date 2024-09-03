import { swap0xRequest } from "@/helpers/0x";
import { getYearnVaultWithdrawAmount } from "@/helpers/getYearnVaultWithdrawAmount";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const fetchDelevYvWethV20xData = async (
  cauldronObject,
  collateralAmount,
  slipage,
  to
) => {
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = wethAddress;
  const selAmount = await getYearnVaultWithdrawAmount(
    collateralAmount,
    to
  );

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

export default fetchDelevYvWethV20xData;
