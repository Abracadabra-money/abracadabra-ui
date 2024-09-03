import poolsAbi from "@/abis/borrowPoolsAbi/index";
import tokensAbi from "@/abis/tokensAbi/index";
import { useImage } from "@/helpers/useImage";

import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/WETH.png`),
    name: "WETH",
    chainId: 81457,
    id: 1,
    liquidationFee: 6,
    mcr: 80,
    borrowFee: 0.5,
    version: 4,
    cauldronSettings: {
      is0xSwap: false,
      isSwappersActive: false,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: true,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      isTesting: false,
    },
    contract: {
      name: "CauldronV4",
      address: "0x79e8CAd80E2aA49A246B789584C45aAB1CFe402e",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "WETH",
      decimals: 18,
      address: "0x4300000000000000000000000000000000000004",
      abi: tokensAbi.wETH,
    },
    mimInfo,
  },
];

export default config;
