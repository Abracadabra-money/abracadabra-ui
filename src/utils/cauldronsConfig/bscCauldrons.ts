import poolsAbi from "@/abis/borrowPoolsAbi/index";
import tokensAbi from "@/abis/tokensAbi/index";
import swapAbi from "@/abis/swap";
import reverseSwapAbi from "@/abis/reverseSwap";
import { useImage } from "@/helpers/useImage";

import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/BNB.png`),
    name: "WBNB",
    chainId: 56,
    id: 1,
    liquidationFee: 10,
    mcr: 85,
    borrowFee: 0.5,
    version: 2,
    cauldronSettings: {
      isSwappersActive: false,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: true,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: true,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
    },
    contract: {
      name: "CauldronV2MultiChain",
      address: "0x692CF15F80415D83E8c0e139cAbcDA67fcc12C90",
      abi: poolsAbi.CauldronV2Multichain,
    },
    collateralInfo: {
      name: "WBNB",
      decimals: 18,
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      abi: tokensAbi.WBNB,
    },
    mimInfo,
    leverageInfo: {
      address: "0x197De282d7b5cEFfFD8f8B0196c30e8401593CF6",
      abi: swapAbi,
    },
    deleverageInfo: {
      address: "0x1D7C1C99045C1c776607F8C1eC9DDd27a2d319D3",
      abi: reverseSwapAbi,
    },
  },
  {
    icon: useImage(`assets/images/tokens/CAKE.png`),
    name: "CAKE",
    chainId: 56,
    id: 2,
    liquidationFee: 12.5,
    mcr: 75,
    borrowFee: 0.5,
    version: 2,
    cauldronSettings: {
      isSwappersActive: false,
      isDegenBox: true,
      strategyLink:
        "https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/AyHB_Ir-nb59HXY2o4H4ysBf5D1yPkWyh-xghKzfCeg",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: true,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
    },
    contract: {
      name: "CauldronV2MultiChain",
      address: "0xF8049467F3A9D50176f4816b20cDdd9bB8a93319",
      abi: poolsAbi.CauldronV2Multichain,
    },
    collateralInfo: {
      name: "CAKE",
      decimals: 18,
      address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      abi: tokensAbi.CAKE,
    },
    mimInfo,
    leverageInfo: {
      address: "0x197De282d7b5cEFfFD8f8B0196c30e8401593CF6",
      abi: swapAbi,
    },
    deleverageInfo: {
      address: "0x1D7C1C99045C1c776607F8C1eC9DDd27a2d319D3",
      abi: reverseSwapAbi,
    },
  },
];

export default config;
