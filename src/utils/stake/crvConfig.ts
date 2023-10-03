import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import type { CrvStakeConfig } from "@/types/crv/configsInfo";

export const crvStakeConfig: CrvStakeConfig = {
  1: {
    mainToken: {
      name: "cvx3pool",
      icon: useImage(`assets/images/tokens/Convex-Curve.png`),
      decimals: 18,
      contract: {
        address: "0xd92494CB921E5C0d3A39eA88d0147bbd82E51008",
        abi: tokensAbi.stkcvx3Crv,
      },
    },
    stakeToken: {
      name: "3Crv",
      icon: useImage(`assets/images/tokens/3CRV.png`),
      decimals: 18,
      contract: {
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        abi: tokensAbi.crv,
      },
    },
    tokensRate: 1000000000000000000n,
  },
};
