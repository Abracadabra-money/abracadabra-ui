import poolsAbi from "@/abis/borrowPoolsAbi/index";
import tokensAbi from "@/abis/tokensAbi/index";
import { useImage } from "@/helpers/useImage";

import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0xB734c264F83E39Ef6EC200F99550779998cC812d",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/MIM-HONEY.png`),
    name: "MIM/HONEY",
    chainId: 80085,
    id: 1,
    liquidationFee: 6,
    mcr: 90,
    borrowFee: 1,
    version: 4,
    cauldronSettings: {
      is0xSwap: false,
      isSwappersActive: false,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
    //   isMimHoneyLP: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0x6aBD7831C3a00949dabCE4cCA74B4B6B327d6C26",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "MIM/HONEY LP",
      decimals: 18,
      address: "0x2dd5691de6528854c60fd67da57ad185f6d1666d",
      abi: tokensAbi.opUSDC, // NOTICE
    },
    mimInfo,
    // leverageInfo: {
    //   address: "0xD6b8bd85A9593cb47c8C15C95bbF3e593c5Dc591",
    //   abi: BexLpLevSwapper,
    // },
    // deleverageInfo: {
    //   address: "0x6C0fB20908Bb1AE089Af7b2dE774968Add8fD5b7",
    //   abi: BexLpSwapper,
    // },
  },
];

export default config;