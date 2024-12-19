import { utils } from "ethers";
// import { swap0xRequestV2 } from "@/helpers/0x";
import { swapOdosRequest } from "@/helpers/odos";

import type { CauldronInfo } from "@/helpers/cauldron/types";
import { simulateContractHelper } from "@/helpers/walletClienHelper";
import type { BigNumber } from "ethers";

import SDEUSDSwapperAbi from "@/abis/SDEUSDSwapper";
import type { Address } from "viem";
const deUSDAddress = "0x15700B564Ca08D9439C58cA5053166E8317aa138";

const getDeUsd0xData = async (
  cauldronObject: CauldronInfo,
  collateralAmount: BigNumber,
  slipage: number
) => {
  //@ts-ignore
  const { mim, liquidationSwapper, collateral } = cauldronObject.contracts;

  const { result } = await simulateContractHelper({
    address: liquidationSwapper!.address,
    abi: SDEUSDSwapperAbi,
    functionName: "previewSDEUSDOut",
    args: [collateralAmount],
  });

  const deUSDAmount = result;

  const response = await swapOdosRequest(
    cauldronObject.config.chainId,
    mim.address as Address,
    deUSDAddress as Address,
    slipage,
    // @ts-ignore
    deUSDAmount,
    liquidationSwapper!.address as Address
  );

  return utils.defaultAbiCoder.encode(
    ["address", "bytes"],
    // @ts-ignore
    [response.to, response.data]
  );
};

export default getDeUsd0xData;
