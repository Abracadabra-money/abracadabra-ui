import tokensAbi from "@/utils/abi/tokensAbi/";
import magicApeLensAbi from "@/utils/abi/magicApeLens";

export const config = {
  magicApe: {
    address: "0xf35b31B941D94B249EaDED041DB1b05b7097fEb6",
    abi: tokensAbi.magicApe,
  },
  lens: {
    address: "0xefdaC7dd721985b4Bd7Fede78465fE3525b468fd",
    abi: magicApeLensAbi,
  },
};
