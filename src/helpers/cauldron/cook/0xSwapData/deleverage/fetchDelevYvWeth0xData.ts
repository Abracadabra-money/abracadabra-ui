import type { BigNumber } from "ethers";
import { swap0xRequestV2 } from "@/helpers/0x";
import { encodeAbiParameters, type Address } from "viem";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getYearnVaultWithdrawAmount } from "@/helpers/getYearnVaultWithdrawAmount";

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const fetchDelevYvWethV20xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number,
  to: Address
) => {
  const { liquidationSwapper, mim } = cauldronObject.contracts;

  const selToken = wethAddress;
  const selAmount = await getYearnVaultWithdrawAmount(collateralAmount, to);

  const swapResponse = await swap0xRequestV2(
    cauldronObject.config.chainId,
    mim.address,
    selToken,
    slipage,
    selAmount,
    liquidationSwapper!.address
  );

  return encodeAbiParameters(
    [
      { name: "to", type: "address" },
      { name: "swapData", type: "bytes" },
    ],
    [swapResponse.to, swapResponse.data]
  );
};

export default fetchDelevYvWethV20xData;
