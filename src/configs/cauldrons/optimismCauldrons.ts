import poolsAbi from "@/abis/borrowPoolsAbi/index";
import tokensAbi from "@/abis/tokensAbi/index";
import zeroXLevSwapper from "@/abis/zeroXLevSwapper.js";
import zeroXLiqSwapper from "@/abis/zeroXLiqSwapper";
import lptokenWrapperAbi from "@/abis/lp/tokenWrapeerAbi";
import lpAbi from "@/abis/lp/lpAbi";
import { useImage } from "@/helpers/useImage";

import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0xB153FB3d196A8eB25522705560ac152eeEc57901",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/OP_USDC.png`),
    name: "Velodrome Volatile OP/USDC",
    chainId: 10,
    id: 1,
    liquidationFee: 8,
    mcr: 70,
    borrowFee: 0,
    version: 3,
    cauldronSettings: {
      is0xSwap: true,
      isSwappersActive: true,
      isDegenBox: true,
      strategyLink:
        "https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/Z9bhlbcfDTByubuwSzCahPMhpvYxnOaC0sBYU12Eh_Y",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: true,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      isVelodrome: true,
    },
    contract: {
      name: "CauldronV3_2",
      address: "0x68f498C230015254AFF0E1EB6F85Da558dFf2362",
      abi: poolsAbi.CauldronV3_2,
    },
    collateralInfo: {
      name: "wOP/USDC",
      decimals: 18,
      address: "0x6eb1709e0b562097bf1cc48bc6a378446c297c04",
      abi: tokensAbi.opUSDC,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      useUnwrappedByDefault: true,
      unwrappedToken: {
        name: "OP/USDC",
        icon: useImage(`assets/images/tokens/OP_USDC.png`),
        address: "0x47029bc8f5CBe3b464004E87eF9c9419a48018cd",
        abi: lpAbi,
      },
      wrapper: {
        address: "0x1fff78fd2e139bc1315711dd3ea176bc7028635a",
        abi: lptokenWrapperAbi,
      },
    },
    leverageInfo: {
      address: "0xf76DA2D3656E1cC5Ca2Fbb9663C89f7d8AAe20Fc",
      abi: zeroXLevSwapper,
    },
    deleverageInfo: {
      address: "0x79533F85479e04d2214305638B6586b724beC951",
      abi: zeroXLiqSwapper,
    },
  },
];

export default config;
