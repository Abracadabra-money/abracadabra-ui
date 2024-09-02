//_GeneralIntegrate
import DecimalMath from "./DecimalMath";

// NOTICE
const sqrt = (y: bigint): bigint => {
  let z: bigint = 0n;
  if (y > 3n) {
    z = y;
    let x = y / 2n + 1n;
    while (x < z) {
      z = x;
      x = (y / x + x) / 2n;
    }
  } else if (y != 0n) {
    z = 1n;
  }
  return z;
};

const divCeil = (a: bigint, b: bigint): bigint => {
  const quotient = a / b;
  const remainder = a - quotient * b;
  if (remainder > 0n) {
    return quotient + 1n;
  } else {
    return quotient;
  }
};

const _GeneralIntegrate = (
  V0: bigint,
  V1: bigint,
  V2: bigint,
  i: bigint,
  k: bigint
) => {
  if (V0 == 0n) {
    throw new Error("_GeneralIntegrate V0 is 0");
  }

  const fairAmount = i * (V1 - V2); // i*delta

  if (k == 0n) {
    return fairAmount / DecimalMath.ONE;
  }

  const V0V0V1V2 = DecimalMath.divFloor((V0 * V0) / V1, V2);
  const penalty = DecimalMath.mulFloor(k, V0V0V1V2); // k(V0^2/V1/V2)
  return ((DecimalMath.ONE - k + penalty) * fairAmount) / DecimalMath.ONE2;
};

const _SolveQuadraticFunctionForTarget = (
  V1: bigint,
  delta: bigint,
  i: bigint,
  k: bigint
) => {
  if (k == 0n) {
    return V1 + DecimalMath.mulFloor(i, delta);
  }

  if (V1 == 0n) {
    return 0n;
  }

  let _sqrt: bigint;
  const ki = 4n * k * i;
  if (ki == 0n) {
    _sqrt = DecimalMath.ONE;
  } else if ((ki * delta) / ki == delta) {
    _sqrt = sqrt((ki * delta) / V1 + DecimalMath.ONE2);
  } else {
    _sqrt = sqrt((ki / V1) * delta + DecimalMath.ONE2);
  }
  const premium =
    DecimalMath.divFloor(_sqrt - DecimalMath.ONE, k * 2n) + DecimalMath.ONE;
  // V0 is greater than or equal to V1 according to the solution
  return DecimalMath.mulFloor(V1, premium);
};

const _SolveQuadraticFunctionForTrade = (
  V0: bigint,
  V1: bigint,
  delta: bigint,
  i: bigint,
  k: bigint
) => {
  if (V0 == 0n) {
    throw new Error("_SolveQuadraticFunctionForTrade V0 is 0");
  }

  if (delta == 0n) {
    return 0n;
  }

  if (k == 0n) {
    return DecimalMath.mulFloor(i, delta) > V1
      ? V1
      : DecimalMath.mulFloor(i, delta);
  }

  if (k == DecimalMath.ONE) {
    // if k==1
    // Q2=Q1/(1+ideltaBQ1/Q0/Q0)
    // temp = ideltaBQ1/Q0/Q0
    // Q2 = Q1/(1+temp)
    // Q1-Q2 = Q1*(1-1/(1+temp)) = Q1*(temp/(1+temp))
    // uint256 temp = i.mul(delta).mul(V1).div(V0.mul(V0));
    let temp;
    const idelta = i * delta;
    if (idelta == 0n) {
      temp = 0n;
    } else if ((idelta * V1) / idelta == V1) {
      temp = (idelta * V1) / (V0 * V0);
    } else {
      temp = (((delta * V1) / V0) * i) / V0;
    }
    return (V1 * temp) / (temp + DecimalMath.ONE);
  }

  // calculate -b value and sig
  // b = kQ0^2/Q1-i*deltaB-(1-k)Q1
  // part1 = (1-k)Q1 >=0
  // part2 = kQ0^2/Q1-i*deltaB >=0
  // bAbs = abs(part1-part2)
  // if part1>part2 => b is negative => bSig is false
  // if part2>part1 => b is positive => bSig is true
  const part2 = ((k * V0) / V1) * V0 + i * delta; // kQ0^2/Q1-i*deltaB
  let bAbs = (DecimalMath.ONE - k) * V1; // (1-k)Q1

  let bSig;
  if (bAbs >= part2) {
    bAbs = bAbs - part2;
    bSig = false;
  } else {
    bAbs = part2 - bAbs;
    bSig = true;
  }
  bAbs = bAbs / DecimalMath.ONE;

  // calculate sqrt
  let squareRoot = DecimalMath.mulFloor(
    (DecimalMath.ONE - k) * 4n,
    DecimalMath.mulFloor(k, V0) * V0
  ); // 4(1-k)kQ0^2
  squareRoot = sqrt(bAbs * bAbs + squareRoot); // sqrt(b*b+4(1-k)kQ0*Q0)

  // final res
  const denominator = (DecimalMath.ONE - k) * 2n; // 2(1-k)
  let numerator;
  if (bSig) {
    numerator = squareRoot - bAbs;
    if (numerator == 0n) {
      throw new Error("_SolveQuadraticFunctionForTrade numerator is 0");
    }
  } else {
    numerator = bAbs + squareRoot;
  }

  const V2 = DecimalMath.divCeil(numerator, denominator);
  if (V2 > V1) {
    return 0n;
  } else {
    return V1 - V2;
  }
};

export default {
  sqrt,
  divCeil,
  _GeneralIntegrate,
  _SolveQuadraticFunctionForTarget,
  _SolveQuadraticFunctionForTrade,
};
