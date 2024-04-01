import type { PMMState } from "../types";
import Math from "./Math";
import DecimalMath from "./DecimalMath";

export const sellBaseToken = (state: PMMState, payBaseAmount: bigint) => {
  let receiveQuoteAmount;
  let newR;

  if (state.R == 1) {
    // case 1: R=1
    // R falls below one
    receiveQuoteAmount = _ROneSellBaseToken(state, payBaseAmount);
    newR = -1;
  } else if (state.R > 1) {
    const backToOnePayBase = state.B0 - state.B;
    const backToOneReceiveQuote = state.Q - state.Q0;
    // case 2: R>1
    // complex case, R status depends on trading amount
    if (payBaseAmount < backToOnePayBase) {
      // case 2.1: R status do not change
      receiveQuoteAmount = _RAboveSellBaseToken(state, payBaseAmount);
      newR = 2;
      if (receiveQuoteAmount > backToOneReceiveQuote) {
        // [Important corner case!] may enter this branch when some precision problem happens. And consequently contribute to negative spare quote amount
        // to make sure spare quote>=0, mannually set receiveQuote=backToOneReceiveQuote
        receiveQuoteAmount = backToOneReceiveQuote;
      }
    } else if (payBaseAmount == backToOnePayBase) {
      // case 2.2: R status changes to ONE
      receiveQuoteAmount = backToOneReceiveQuote;
      newR = 1;
    } else {
      // case 2.3: R status changes to BELOW_ONE
      receiveQuoteAmount =
        backToOneReceiveQuote +
        _ROneSellBaseToken(state, payBaseAmount - backToOnePayBase);
      newR = -1;
    }
  } else {
    // state.R == RState.BELOW_ONE
    // case 3: R<1
    receiveQuoteAmount = _RBelowSellBaseToken(state, payBaseAmount);
    newR = -1;
  }

  return {
    receiveQuoteAmount,
    newR,
  };
};

export const sellQuoteToken = (state: PMMState, payQuoteAmount: bigint) => {
  let receiveBaseAmount;
  let newR;

  if (state.R == 1) {
    receiveBaseAmount = _ROneSellQuoteToken(state, payQuoteAmount);
    newR = 2;
  } else if (state.R > 1) {
    receiveBaseAmount = _RAboveSellQuoteToken(state, payQuoteAmount);
    newR = 2;
  } else {
    const backToOnePayQuote = state.Q0 - state.Q;
    const backToOneReceiveBase = state.B - state.B0;
    if (payQuoteAmount < backToOnePayQuote) {
      receiveBaseAmount = _RBelowSellQuoteToken(state, payQuoteAmount);
      newR = -1;
      if (receiveBaseAmount > backToOneReceiveBase) {
        receiveBaseAmount = backToOneReceiveBase;
      }
    } else if (payQuoteAmount == backToOnePayQuote) {
      receiveBaseAmount = backToOneReceiveBase;
      newR = 1;
    } else {
      receiveBaseAmount =
        backToOneReceiveBase +
        _ROneSellQuoteToken(state, payQuoteAmount - backToOnePayQuote);
      newR = 2;
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

export default {
    sellBaseToken,
    sellQuoteToken
}