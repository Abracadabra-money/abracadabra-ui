import tokensAbi from "@/utils/abi/tokensAbi/index";
import magicLVLJuniorAbi from "@/utils/abi/oracle/magicLVLJunior";
import magicLVLMezzanineAbi from "@/utils/abi/oracle/magicLVLMezzanine";
import magicLVLSeniorAbi from "@/utils/abi/oracle/magicLVLSenior";
import lvlIcon from "@/assets/images/tokens/LVL.png";
import mLvlSeniorIcon from "@/assets/images/tokens/mLvlSenior.png";
import mLvlMezzanineIcon from "@/assets/images/tokens/mLvlMezzanine.png";
import mLvlJuniorIcon from "@/assets/images/tokens/mLvlJunior.png";

export default [
  {
    name: "Senior",
    mainToken: {
      name: "mLVS",
      address: "0xD8Cbd5b22D7D37c978609e4e394cE8B9C003993b",
      decimals: 18,
      abi: tokensAbi.mLvlSenior,
      icon: mLvlSeniorIcon,
    },
    stakeToken: {
      name: "snrLLP",
      address: "0xb5c42f84ab3f786bca9761240546aa9cec1f8821",
      decimals: 18,
      abi: tokensAbi.lvlSenior,
      icon: lvlIcon,
    },
    oracle: {
      address: "0x75097B761514588b7c700F71a84DDBB5AD686074",
      abi: magicLVLSeniorAbi,
    },
    pid: 0,
  },
  {
    name: "Mezzanine",
    mainToken: {
      name: "mLVM",
      address: "0x87aC701ba8acb1966526375da68A692CebB8AF75",
      decimals: 18,
      abi: tokensAbi.mLvlMezzanine,
      icon: mLvlMezzanineIcon,
    },
    stakeToken: {
      name: "mzeLLP",
      address: "0x4265af66537F7BE1Ca60Ca6070D97531EC571BDd",
      decimals: 18,
      abi: tokensAbi.lvlMezzanine,
      icon: lvlIcon,
    },
    oracle: {
      address: "0xc2758B836Cf4eebb4712746A087b426959E1De26",
      abi: magicLVLMezzanineAbi,
    },
    pid: 1,
  },
  {
    name: "Junior",
    mainToken: {
      name: "mLVJ",
      address: "0xC094c2a5C349eAd7839C1805126Da71Cc1cc1A39",
      decimals: 18,
      abi: tokensAbi.mLvlJunior,
      icon: mLvlJuniorIcon,
    },
    stakeToken: {
      name: "jnrLLP",
      address: "0xcc5368f152453d497061cb1fb578d2d3c54bd0a0",
      decimals: 18,
      abi: tokensAbi.lvlJunior,
      icon: lvlIcon,
    },
    oracle: {
      address: "0xDd45c6614305D705a444B3baB0405D68aC85DbA5",
      abi: magicLVLJuniorAbi,
    },
    pid: 2,
  },
];
