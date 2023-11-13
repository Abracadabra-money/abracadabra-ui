import GMXReaderAbi from "@/utils/abi/gm/GMXReaderAbi";
import { Contract } from "ethers";

import { getContractMarketPrices } from "./getContractMarketPrices";
import { getMarketInfo } from "./getMarketInfo";

import { GMX_READER, DATA_STORE, ZERO_ADDRESS } from "@/constants/gm";

export const getDepositAmount = async (
  longTokenAmount,
  shortTokenAmount,
  provider
) => {
  const GMXReaderContract = new Contract(GMX_READER, GMXReaderAbi, provider);

  const marketInfo = await getMarketInfo(provider);

  const uiFeeReceiver = ZERO_ADDRESS;
  const prices = await getContractMarketPrices(marketInfo);

  const depositAmountOut = await GMXReaderContract.getDepositAmountOut(
    DATA_STORE,
    marketInfo,
    prices,
    longTokenAmount,
    shortTokenAmount,
    uiFeeReceiver
  );

  console.log(depositAmountOut.toString());
  return depositAmountOut;
};
