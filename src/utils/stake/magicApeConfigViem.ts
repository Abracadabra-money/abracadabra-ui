import oracleAbi from "@/utils/abi/oracle";
import { useImage } from "@/helpers/useImage";
import chainLinkAbi from "@/utils/abi/chainLink";
import tokensAbi from "@/utils/abi/tokensAbi/index";

export const magicApeConfigViem = {
  1: {
    mainToken: {
      name: "magicAPE",
      decimals: 18,
      icon: useImage("assets/images/tokens/mAPE.png"),
      rateIcon: useImage("assets/images/ape/ape-circle.png"),
      contract: {
        address: "0xf35b31B941D94B249EaDED041DB1b05b7097fEb6",
        abi: tokensAbi.magicApe,
      },
    },
    stakeToken: {
      name: "APE",
      decimals: 18,
      icon: useImage("assets/images/tokens/APE.png"),
      contract: {
        address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
        abi: tokensAbi.APE,
      },
    },
    oracle: {
      address: "0x64422a1337082Bf99E6052fF52684374Eb1A7fB7",
      abi: oracleAbi,
    },
    chainLink: {
      address: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
      abi: chainLinkAbi,
    },
    rewardToken: {
      symbol: "APE",
      icon: useImage("assets/images/ape/ape-circle.png"),
    },
  },
};
