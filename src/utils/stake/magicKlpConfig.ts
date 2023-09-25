import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import managerAbi from "@/utils/abi/klp/manager";
import readerAbi from "@/utils/abi/klp/reader";
import type { MagicKlpConfigs } from "@/types/magicKlp/configsInfo";

export const magicKlpConfig: MagicKlpConfigs = {
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
    manager: {
      contract: {
        address: "0x53e6d11b66abf344028b69f2468120c6afa47f53",
        abi: managerAbi,
      },
    },
    reader: {
      contract: {
        address: "0xE027Ee35939Dd0A5Dd6C7701656159e2f6e2BAE7",
        abi: readerAbi,
      },
    },
  },
};
