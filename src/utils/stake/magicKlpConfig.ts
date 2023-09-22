import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/utils/abi/tokensAbi/index";

export const magicKlpConfig = {
  2222: {
    mainToken: {
      name: "MagicKLP",
      decimals: 18,
      icon: useImage("assets/images/tokens/magicKLP.png"),
      rateIcon: useImage("assets/images/tokens/KLP.png"),
      contract: {
        address: "0x1F69c1ca2C8Fc0212C26830E7736AE8f392F09ca",
        abi: tokensAbi.mKLP,
      },
    },
    stakeToken: {
      name: "KLP",
      decimals: 18,
      icon: useImage(`assets/images/tokens/KLP.png`),
      contract: {
        address: "0x98FD2baCAC66574aC054BB888c70d40BbF4F452e",
        abi: tokensAbi.sKLP,
      },
    },
  },
};
