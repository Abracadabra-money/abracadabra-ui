import depositTokenAbi from "@/utils/abi/tokensAbi/Crv";
import mainTokenAbi from "@/utils/abi/tokensAbi/stkcvx3Crv";
import { useImage } from "@/helpers/useImage";

export default {
  depositToken: {
    name: "3Crv",
    icon: useImage(`assets/images/tokens/3CRV.png`),
    decimals: 18,
    address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
    abi: depositTokenAbi,
  },
  mainToken: {
    name: "cvx3pool",
    icon: useImage(`assets/images/tokens/Convex-Curve.png`),
    decimals: 18,
    address: "0xd92494CB921E5C0d3A39eA88d0147bbd82E51008",
    abi: mainTokenAbi,
  },
};
