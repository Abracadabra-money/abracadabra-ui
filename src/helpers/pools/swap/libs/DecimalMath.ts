import { decimalMathLensContract } from "./decimalMathLensContract";
import { interpretContract } from "./interpretContract";

export const mulFloor = (target: bigint, d: bigint): bigint => {
  return interpretContract({
    ...decimalMathLensContract,
    functionName: "mulFloor",
    args: [target, d],
  });
};

export const mulCeil = (target: bigint, d: bigint): bigint => {
  return interpretContract({
    ...decimalMathLensContract,
    functionName: "mulCeil",
    args: [target, d],
  });
};

export const divFloor = (target: bigint, d: bigint): bigint => {
  return interpretContract({
    ...decimalMathLensContract,
    functionName: "divFloor",
    args: [target, d],
  });
};

export const divCeil = (target: bigint, d: bigint): bigint => {
  return interpretContract({
    ...decimalMathLensContract,
    functionName: "divCeil",
    args: [target, d],
  });
};

export const reciprocalFloor = (target: bigint): bigint => {
  return interpretContract({
    ...decimalMathLensContract,
    functionName: "reciprocalFloor",
    args: [target],
  });
};

export default {
  mulFloor,
  mulCeil,
  divFloor,
  divCeil,
  reciprocalFloor,
};
