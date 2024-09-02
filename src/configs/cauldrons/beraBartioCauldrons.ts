import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import poolsAbi from "@/abis/borrowPoolsAbi/index";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0x08B918dD18E087893bb9d711d9E0BBaA7a63Ef63",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/MIM-HONEY.png`),
    name: "MIM/HONEY",
    chainId: 80084,
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
      isTesting: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0x6099D4AAb708D5871569e43C7A40458Aa2ab293c",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "MIM/HONEY LP",
      decimals: 18,
      address: "0xa11E60393dbAEC5A45416F063de2aBf94aF2cD50",
      abi: tokensAbi.opUSDC, // NOTICE
    },
    mimInfo,
  },
];

export default config;
