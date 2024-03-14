import Math from "./Math";

export const ONE = BigInt(10 ** 18);
export const ONE2 = BigInt(10 ** 36);

export const mulFloor = (target: bigint, d: bigint): bigint => {
  return (target * d) / ONE;
};

export const mulCeil = (target: bigint, d: bigint): bigint => {
  return Math.divCeil(target * d, ONE);
};

export const divFloor = (target: bigint, d: bigint): bigint => {
  return (target * ONE) / d;
};

export const divCeil = (target: bigint, d: bigint): bigint => {
  return Math.divCeil(target * ONE, d); // NOTICE: check
};

export const reciprocalFloor = (target: bigint): bigint => {
  return Math.divCeil(ONE2, target);
};

export default {
  ONE,
  ONE2,
  mulFloor,
  mulCeil,
  divFloor,
  divCeil,
  reciprocalFloor,
};
