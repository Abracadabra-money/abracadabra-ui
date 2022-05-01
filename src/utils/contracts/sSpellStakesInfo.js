import tokensAbi from "@/utils/abi/tokensAbi/index";

export default {
  mainToken: {
    name: "sSPELL",
    address: "0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9",
    decimals: 18,
    abi: tokensAbi.sSPELL,
    icon: require("@/assets/images/tokens/sSPELL.png"),
  },
  stakeToken: {
    name: "SPELL",
    address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
    decimals: 18,
    abi: tokensAbi.SPELL,
    icon: require("@/assets/images/tokens/SPELL.png"),
  },
};
