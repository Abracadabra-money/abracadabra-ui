import { ethers } from "ethers";

export function hashData(
  dataTypes: Array<string>,
  dataValues: Array<any>
): string {
  const bytes = ethers.utils.defaultAbiCoder.encode(dataTypes, dataValues);
  const hash = ethers.utils.keccak256(ethers.utils.arrayify(bytes));

  return hash;
}

export function hashString(string: string): string {
  return hashData(["string"], [string]);
}
