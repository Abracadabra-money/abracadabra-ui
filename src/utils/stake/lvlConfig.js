import tokensAbi from "@/utils/abi/tokensAbi/index";
import magicLVLJuniorAbi from "@/utils/abi/oracle/magicLVLJunior";
import magicLVLMezzanineAbi from "@/utils/abi/oracle/magicLVLMezzanine";
import magicLVLSeniorAbi from "@/utils/abi/oracle/magicLVLSenior";

export default [
  {
    name: "Senior",
    mainToken: {
      name: "mLVS",
      address: "0x0253DB0DDA6c063fAE1E5fB28318e6DbE1c14e16",
      decimals: 18,
      abi: tokensAbi.mLvlSenior,
      icon: require("@/assets/images/tokens/mLvlSenior.png"),
    },
    stakeToken: {
      name: "snrLLP",
      address: "0xb5c42f84ab3f786bca9761240546aa9cec1f8821",
      decimals: 18,
      abi: tokensAbi.lvlSenior,
      icon: require(`@/assets/images/tokens/LVL.png`),
    },
    oracle: {
      address: "0x93503ab9f3Aa708B757cAf3238B7673baB2e3409",
      abi: magicLVLSeniorAbi,
    },
    pid: 0,
  },
  {
    name: "Mezzanine",
    mainToken: {
      name: "mLVM",
      address: "0x75adc3b980C5c73EE35eCC41Bf0D8B19699501b7",
      decimals: 18,
      abi: tokensAbi.mLvlMezzanine,
      icon: require("@/assets/images/tokens/mLvlMezzanine.png"),
    },
    stakeToken: {
      name: "mzeLLP",
      address: "0x4265af66537F7BE1Ca60Ca6070D97531EC571BDd",
      decimals: 18,
      abi: tokensAbi.lvlMezzanine,
      icon: require(`@/assets/images/tokens/LVL.png`),
    },
    oracle: {
      address: "0x4d526F103307b548227f502655f7B80796B64F52",
      abi: magicLVLMezzanineAbi,
    },
    pid: 1,
  },
  {
    name: "Junior",
    mainToken: {
      name: "mLVJ",
      address: "0x2906ae98fdAf225a697a09158D10843A89CF0FC5",
      decimals: 18,
      abi: tokensAbi.mLvlJunior,
      icon: require("@/assets/images/tokens/mLvlJunior.png"),
    },
    stakeToken: {
      name: "jnrLLP",
      address: "0xcc5368f152453d497061cb1fb578d2d3c54bd0a0",
      decimals: 18,
      abi: tokensAbi.lvlJunior,
      icon: require(`@/assets/images/tokens/LVL.png`),
    },
    oracle: {
      address: "0x978D34A96780414c5978AB3e861B0D098B2A006c",
      abi: magicLVLJuniorAbi,
    },
    pid: 2,
  },
];
