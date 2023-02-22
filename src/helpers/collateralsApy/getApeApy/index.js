import { ethers } from "ethers";
import agicApeLensAbi from "@/helpers/collateralsApy/getApeApy/apeCoinStakingAbi.js";

const magicApeLensAddress = "0xefdaC7dd721985b4Bd7Fede78465fE3525b468fd";

const getApeApy = async (provider) => {
  const magicApeLensContract = await new ethers.Contract(
    magicApeLensAddress,
    JSON.stringify(agicApeLensAbi),
    provider
  );

  const apeCoinInfo = await magicApeLensContract.getApeCoinInfo();
  const apr = apeCoinInfo[0] / 100;
  return (Math.pow(1 + apr / 100 / 730, 730) - 1) * 100 * 0.99;
};

export { getApeApy };
