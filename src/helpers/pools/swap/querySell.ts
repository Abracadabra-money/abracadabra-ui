import type {
  RState,
  MagicLPInfo,
  MagicLPInfoUserInfo,
} from "@/helpers/pools/swap/types";
import { parseAbi } from "viem";
import type { Address } from "viem";
import PMMPricing from "@/helpers/pools/swap/libs/PMMPricing";
import DecimalMath from "@/helpers/pools/swap/libs/DecimalMath";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

const querySellAbi = parseAbi([
  "function querySellBase(address trader, uint256 payBaseAmount) view returns (uint256 receiveQuoteAmount, uint256 mtFee, uint8 newRState, uint256 newBaseTarget)",
  "function querySellQuote(address trader, uint256 payQuoteAmount) view returns (uint256 receiveBaseAmount, uint256 mtFee, uint8 newRState, uint256 newQuoteTarget)",
]);

const querySellV2Abi = parseAbi([
  "function querySellBase((uint256 i, uint256 K, uint256 B, uint256 Q, uint256 B0, uint256 Q0, uint8 R) state, address trader, uint256 payBaseAmount) view returns (uint256 receiveQuoteAmount, uint256 fee, uint8 newRState, uint256 newBaseTarget)",
  "function querySellQuote((uint256 i, uint256 K, uint256 B, uint256 Q, uint256 B0, uint256 Q0, uint8 R) state, address trader, uint256 payQuoteAmount) view returns (uint256 receiveBaseAmount, uint256 fee, uint8 newRState, uint256 newQuoteTarget)",
]);

interface QuerySell {
  fee: bigint;
  mtFee: bigint;
  lpFee: bigint;
  newTarget: bigint;
  newRState: RState;
  outputAmount: bigint;
  feeAmount: bigint;
  outputAmountWithoutFee: bigint;
}

const EMPTY_QUERY_SELL = {
  fee: 0n,
  mtFee: 0n,
  lpFee: 0n,
  newTarget: 0n,
  newRState: 0,
  outputAmount: 0n,
  feeAmount: 0n,
  outputAmountWithoutFee: 0n,
};

export const querySell = async (
  lpInfo: MagicLPInfo,
  account: Address,
  sellBase = true,
  amount: bigint
): Promise<QuerySell> => {
  const isV2 = lpInfo.config.settings?.mlpVersion === 2;

  const payload = isV2 ? [lpInfo.PMMState, account, amount] : [account, amount];
  const abi = isV2 ? querySellV2Abi : querySellAbi;

  const publicClient = getPublicClient(lpInfo.chainId);

  const result = await publicClient.readContract({
    address: lpInfo.contract.address,
    abi: abi,
    functionName: sellBase ? "querySellBase" : "querySellQuote",
    args: [...payload],
  });

  const outputAmount = result[0] || 0n;
  const fee = isV2 ? result[1] || 0n : 0n;

  const mtFee = isV2 ? 0n : result[1] || 0n;
  let lpFee = 0n;

  if (!isV2) {
    const { lpFeeRate, mtFeeRate } = lpInfo.userInfo.userFeeRate;
    const lpFeeAmount = DecimalMath.mulFloor(outputAmount, lpFeeRate);
    lpFee = mtFeeRate === lpFeeRate ? mtFee : lpFeeAmount;
  }

  const newRState = result[2] || 0n;
  const newTarget = result[3] || 0n;
  const feeAmount = isV2 ? fee : mtFee + lpFee;
  const outputAmountWithoutFee = outputAmount + feeAmount;

  return {
    fee,
    mtFee,
    lpFee,
    newTarget,
    newRState,
    outputAmount,
    feeAmount,
    outputAmountWithoutFee,
  };
};

export const querySellBase = (
  payBaseAmount: bigint,
  lpInfo: MagicLPInfo
): QuerySell => {
  const { PMMState, userInfo } = lpInfo;

  const { receiveQuoteAmount, newR } = PMMPricing.sellBaseToken(
    PMMState,
    payBaseAmount
  );

  const { mtFeeRate, lpFeeRate } = userInfo.userFeeRate;

  const mtFee = DecimalMath.mulFloor(receiveQuoteAmount, mtFeeRate);
  const lpFee = DecimalMath.mulFloor(receiveQuoteAmount, lpFeeRate);
  const receiveQuoteAmountAfterFee = receiveQuoteAmount - lpFee - mtFee;

  return {
    fee: 0n,
    mtFee,
    lpFee,
    newTarget: PMMState.B0,
    newRState: newR,
    outputAmount: receiveQuoteAmountAfterFee,
    feeAmount: receiveQuoteAmount - receiveQuoteAmountAfterFee,
    outputAmountWithoutFee: receiveQuoteAmount + mtFee + lpFee,
  };
};

export const querySellBaseV2 = (
  payBaseAmount: bigint,
  lpInfo: MagicLPInfo
): QuerySell => {
  const { PMMState, lpFeeRate } = lpInfo;

  const { receiveQuoteAmount, newR } = PMMPricing.sellBaseToken(
    PMMState,
    payBaseAmount
  );

  const fee = DecimalMath.mulFloor(receiveQuoteAmount, lpFeeRate);
  const receiveQuoteAmountAfterFee = receiveQuoteAmount - fee;

  return {
    fee,
    mtFee: 0n,
    lpFee: 0n,
    newTarget: PMMState.B0,
    newRState: newR,
    outputAmount: receiveQuoteAmountAfterFee,
    feeAmount: receiveQuoteAmount - receiveQuoteAmountAfterFee,
    outputAmountWithoutFee: receiveQuoteAmount + fee,
  };
};

export const querySellQuote = (
  payQuoteAmount: bigint,
  lpInfo: MagicLPInfo
): QuerySell => {
  const { PMMState, userInfo } = lpInfo;
  const { receiveBaseAmount, newR } = PMMPricing.sellQuoteToken(
    PMMState,
    payQuoteAmount
  );

  const { mtFeeRate, lpFeeRate } = userInfo.userFeeRate;

  const mtFee = DecimalMath.mulFloor(receiveBaseAmount, mtFeeRate);
  const lpFee = DecimalMath.mulFloor(receiveBaseAmount, lpFeeRate);

  const receiveBaseAmountAfterFee = receiveBaseAmount - lpFee - mtFee;

  return {
    fee: 0n,
    mtFee,
    lpFee,
    newTarget: PMMState.Q0,
    newRState: newR,
    outputAmount: receiveBaseAmountAfterFee,
    feeAmount: receiveBaseAmount - receiveBaseAmountAfterFee,
    outputAmountWithoutFee: receiveBaseAmount + mtFee + lpFee,
  };
};

export const querySellQuoteV2 = (
  payQuoteAmount: bigint,
  lpInfo: MagicLPInfo
): QuerySell => {
  const { PMMState, lpFeeRate } = lpInfo;
  const { receiveBaseAmount, newR } = PMMPricing.sellQuoteToken(
    PMMState,
    payQuoteAmount
  );

  const fee = DecimalMath.mulFloor(receiveBaseAmount, lpFeeRate);

  const receiveBaseAmountAfterFee = receiveBaseAmount - fee;

  return {
    fee,
    mtFee: 0n,
    lpFee: 0n,
    newTarget: PMMState.Q0,
    newRState: newR,
    outputAmount: receiveBaseAmountAfterFee,
    feeAmount: receiveBaseAmount - receiveBaseAmountAfterFee,
    outputAmountWithoutFee: receiveBaseAmount + fee,
  };
};

export const localQuerySell = (
  amount: bigint,
  lpInfo: MagicLPInfo,
  sellBase = true
): QuerySell => {
  const mlpVersion = lpInfo.config.settings?.mlpVersion;
  const methodQuery = sellBase ? "querySellBase" : "querySellQuote";
  const methodVersion = !!mlpVersion ? `V${mlpVersion}` : "";
  const methodName = methodQuery + methodVersion;

  switch (methodName) {
    case "querySellBase":
      return querySellBase(amount, lpInfo);
    case "querySellBaseV2":
      return querySellBaseV2(amount, lpInfo);
    case "querySellQuote":
      return querySellQuote(amount, lpInfo);
    case "querySellQuoteV2":
      return querySellQuoteV2(amount, lpInfo);
    default:
      return EMPTY_QUERY_SELL;
  }
};
