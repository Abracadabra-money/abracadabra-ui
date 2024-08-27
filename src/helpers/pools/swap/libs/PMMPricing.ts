import { RState, type PMMState } from "../types";
import Math from "./Math";
import DecimalMath from "./DecimalMath";

export const sellBaseToken = (state: PMMState, payBaseAmount: bigint) => {
  let receiveQuoteAmount;
  let newR;

  if (state.R == RState.ONE) {
    // case 1: R=1
    // R falls below one
    receiveQuoteAmount = _ROneSellBaseToken(state, payBaseAmount);
    newR = RState.BELOW_ONE;
  } else if (state.R == RState.ABOVE_ONE) {
    const backToOnePayBase = state.B0 - state.B;
    const backToOneReceiveQuote = state.Q - state.Q0;
    // case 2: R>1
    // complex case, R status depends on trading amount
    if (payBaseAmount < backToOnePayBase) {
      // case 2.1: R status do not change
      receiveQuoteAmount = _RAboveSellBaseToken(state, payBaseAmount);
      newR = RState.ABOVE_ONE;
      if (receiveQuoteAmount > backToOneReceiveQuote) {
        // [Important corner case!] may enter this branch when some precision problem happens. And consequently contribute to negative spare quote amount
        // to make sure spare quote>=0, mannually set receiveQuote=backToOneReceiveQuote
        receiveQuoteAmount = backToOneReceiveQuote;
      }
    } else if (payBaseAmount == backToOnePayBase) {
      // case 2.2: R status changes to ONE
      receiveQuoteAmount = backToOneReceiveQuote;
      newR = RState.ONE;
    } else {
      // case 2.3: R status changes to BELOW_ONE
      receiveQuoteAmount =
        backToOneReceiveQuote +
        _ROneSellBaseToken(state, payBaseAmount - backToOnePayBase);
      newR = RState.BELOW_ONE;
    }
  } else {
    // state.R == RState.BELOW_ONE
    // case 3: R<1
    receiveQuoteAmount = _RBelowSellBaseToken(state, payBaseAmount);
    newR = RState.BELOW_ONE;
  }

  return {
    receiveQuoteAmount,
    newR,
  };
};

export const sellQuoteToken = (state: PMMState, payQuoteAmount: bigint) => {
  let receiveBaseAmount;
  let newR;

  if (state.R == RState.ONE) {
    receiveBaseAmount = _ROneSellQuoteToken(state, payQuoteAmount);
    newR = RState.ABOVE_ONE;
  } else if (state.R == RState.ABOVE_ONE) {
    receiveBaseAmount = _RAboveSellQuoteToken(state, payQuoteAmount);
    newR = RState.ABOVE_ONE;
  } else {
    const backToOnePayQuote = state.Q0 - state.Q;
    const backToOneReceiveBase = state.B - state.B0;
    if (payQuoteAmount < backToOnePayQuote) {
      receiveBaseAmount = _RBelowSellQuoteToken(state, payQuoteAmount);
      newR = RState.BELOW_ONE;
      if (receiveBaseAmount > backToOneReceiveBase) {
        receiveBaseAmount = backToOneReceiveBase;
      }
    } else if (payQuoteAmount == backToOnePayQuote) {
      receiveBaseAmount = backToOneReceiveBase;
      newR = RState.ONE;
    } else {
      receiveBaseAmount =
        backToOneReceiveBase +
        _ROneSellQuoteToken(state, payQuoteAmount - backToOnePayQuote);
      newR = RState.ABOVE_ONE;
    }
  }

  return {
    receiveBaseAmount,
    newR,
  };
};

// ============ R = 1 cases ============

const _ROneSellBaseToken = (state: PMMState, payBaseAmount: bigint): bigint => {
  // in theory Q2 <= targetQuoteTokenAmount
  // however when amount is close to 0, precision problems may cause Q2 > targetQuoteTokenAmount
  return Math._SolveQuadraticFunctionForTrade(
    state.Q0,
    state.Q0,
    payBaseAmount,
    state.i,
    state.K
  );
};

const _ROneSellQuoteToken = (
  state: PMMState,
  payQuoteAmount: bigint
): bigint => {
  return Math._SolveQuadraticFunctionForTrade(
    state.B0,
    state.B0,
    payQuoteAmount,
    DecimalMath.reciprocalFloor(state.i),
    state.K
  );
};

// ============ R < 1 cases ============

const _RBelowSellQuoteToken = (
  state: PMMState,
  payQuoteAmount: bigint
): bigint => {
  return Math._GeneralIntegrate(
    state.Q0,
    state.Q + payQuoteAmount,
    state.Q,
    DecimalMath.reciprocalFloor(state.i),
    state.K
  );
};

const _RBelowSellBaseToken = (
  state: PMMState,
  payBaseAmount: bigint
): bigint => {
  return Math._SolveQuadraticFunctionForTrade(
    state.Q0,
    state.Q,
    payBaseAmount,
    state.i,
    state.K
  );
};

// ============ R > 1 cases ============

const _RAboveSellBaseToken = (state: PMMState, payBaseAmount: bigint) => {
  return Math._GeneralIntegrate(
    state.B0,
    state.B + payBaseAmount,
    state.B,
    state.i,
    state.K
  );
};

const _RAboveSellQuoteToken = (state: PMMState, payQuoteAmount: bigint) => {
  return Math._SolveQuadraticFunctionForTrade(
    state.B0,
    state.B,
    payQuoteAmount,
    DecimalMath.reciprocalFloor(state.i),
    state.K
  );
};

export const getMidPrice = (state: PMMState) => {
  if (state.R == RState.BELOW_ONE) {
    let R = DecimalMath.divFloor((state.Q0 * state.Q0) / state.Q, state.Q);
    R = DecimalMath.ONE - state.K + DecimalMath.mulFloor(state.K, R);
    return DecimalMath.divFloor(state.i, R);
  } else {
    let R = DecimalMath.divFloor((state.B0 * state.B0) / state.B, state.B);
    R = DecimalMath.ONE - state.K + DecimalMath.mulFloor(state.K, R);
    return DecimalMath.mulFloor(state.i, R);
  }
};

export default {
  getMidPrice,
  sellBaseToken,
  sellQuoteToken,
};
