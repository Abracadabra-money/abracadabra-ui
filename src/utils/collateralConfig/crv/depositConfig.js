import depositTokenAbi from "@/utils/abi/tokensAbi/Crv";
import mainTokenAbi from "@/utils/abi/tokensAbi/stkcvx3Crv";

export default {
  depositToken: {
    name: "3Crv",
    icon: require(`@/assets/images/tokensIcon/Token_3Curve.svg`),
    decimals: 18,
    address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
    abi: depositTokenAbi,
  },
  mainToken: {
    name: "cvx3pool",
    icon: require(`@/assets/images/tokensIcon/Token_cvx3pool.svg`),
    decimals: 18,
    address: "0xd92494CB921E5C0d3A39eA88d0147bbd82E51008",
    abi: mainTokenAbi,
  },
};
