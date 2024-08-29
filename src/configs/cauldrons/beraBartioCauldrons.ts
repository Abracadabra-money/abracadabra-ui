import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import poolsAbi from "@/abis/borrowPoolsAbi/index";
import degenBoxERC4626Wrapper from "@/abis/lp/DegenBoxERC4626Wrapper";
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
  {
    icon: useImage(`assets/images/tokens/Kodiak-MIM-Honey.png`),
    name: "MIM/HONEY",
    chainId: 80084,
    id: 2,
    liquidationFee: 7.5,
    mcr: 90,
    borrowFee: 0.5,
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
      address: "0x3b55057F3E5ffFB3c8945EB5e0D703ab02F754eE",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "MagicKodiak Vault",
      decimals: 18,
      address: "0xf11BdAe4Dfe4139884e49e4560a97E5935e4E80C",
      abi: tokensAbi.MagicKodiakVault,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      useUnwrappedByDefault: true,
      unwrappedToken: {
        name: "MIM/HONEY LP",
        icon: useImage(`assets/images/tokens/MIM-HONEY.png`),
        address: "0x74e852a4f88bfbeff01275bb95d5ed77f2967d12",
        abi: tokensAbi.MagicKodiakVault,
      },
      wrapper: {
        address: "0x0E0E2c6204976bA791fBA95eFbb54f9f76556a57",
        abi: degenBoxERC4626Wrapper,
      },
    },
  },
];

export default config;
