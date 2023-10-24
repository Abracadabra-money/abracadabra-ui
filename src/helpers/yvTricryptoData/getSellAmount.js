import { Contract } from "ethers";
import TricryptoUSDT from "@/helpers/yvTricryptoData/abi/TricryptoUSDT";

export const getSellAmount = async (signer, collateralAmount) => {
  const tokenContract = new Contract(
    "0xf5f5B97624542D72A9E06f04804Bf81baA15e2B4",
    TricryptoUSDT,
    signer
  );

  const sellAmount = await tokenContract.calc_withdraw_one_coin(
    collateralAmount,
    0
  );

  return sellAmount;
};
