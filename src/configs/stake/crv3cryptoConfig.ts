import { useImage } from "@/helpers/useImage";
import type { CrvStakeConfig } from "@/types/crv/configsInfo";
import tokensAbi from "@/abis/tokensAbi/index";

export const crv3cryptoConfig: CrvStakeConfig = {
  1: {
    mainToken: {
      name: "cvxtricrypto2",
      icon: useImage(`assets/images/tokens/Convex-Curve3.png`),
      decimals: 18,
      contract: {
        address: "0x5958A8DB7dfE0CC49382209069b00F54e17929C2",
        abi: tokensAbi.stakedThreeCrypto,
      },
    },
    stakeToken: {
      name: "3Crypto2",
      icon: useImage(`assets/images/tokens/3Crypto2.png`),
      decimals: 18,
      contract: {
        address: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
        abi: tokensAbi.crv3crypto,
      },
    },
    tokensRate: 1000000000000000000n,
  },
};
