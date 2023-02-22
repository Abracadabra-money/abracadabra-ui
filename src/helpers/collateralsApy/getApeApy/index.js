import { ethers } from "ethers";

import agicApeLensAbi from "@/helpers/collateralsApy/getApeApy/apeCoinStakingAbi.js";
const magicApeLensAddress = "0xefdaC7dd721985b4Bd7Fede78465fE3525b468fd";
const mApeAddress = "0xf35b31B941D94B249EaDED041DB1b05b7097fEb6";
import mApeAbi from "@/utils/abi/tokensAbi/magicApe";

const getApeApy = async (provider) => {
  const magicApeContract = await new ethers.Contract(
    mApeAddress,
    JSON.stringify(mApeAbi),
    provider
  );

  const magicApeLensContract = await new ethers.Contract(
    magicApeLensAddress,
    JSON.stringify(agicApeLensAbi),
    provider
  );

  const feePercentBips = await magicApeContract.feePercentBips();
  const BIPS = await magicApeContract.BIPS();
  const fee = feePercentBips / BIPS;

  const apeCoinInfo = await magicApeLensContract.getApeCoinInfo();
  const apr = apeCoinInfo[0] / 100;
  return (Math.pow(1 + apr / 100 / 730, 730) - 1) * 100 * (1 - fee);
};

export { getApeApy };
