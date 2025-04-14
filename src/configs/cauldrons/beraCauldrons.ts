import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import poolsAbi from "@/abis/borrowPoolsAbi/index";
import degenBoxERC4626Wrapper from "@/abis/lp/DegenBoxERC4626Wrapper";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import MagicKodiakIslandLevSwapperAbi from "@/abis/MagicKodiakIslandLevSwapper";
import MagicKodiakIslandSwapperAbi from "@/abis/MagicKodiakIslandSwapper";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0x5B82028cfc477C4E7ddA7FF33d59A23FA7Be002a",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  // {
  //   icon: useImage(`assets/images/tokens/Kodiak-MIM-Honey.png`),
  //   name: "MIM/HONEY",
  //   chainId: 80094,
  //   id: 1,
  //   liquidationFee: 5,
  //   mcr: 90,
  //   borrowFee: 0.5,
  //   version: 4,
  //   cauldronSettings: {
  //     is0xSwap: true,
  //     isSwappersActive: true,
  //     isDegenBox: true,
  //     strategyLink: false,
  //     isDepreciated: false,
  //     acceptUseDefaultBalance: false,
  //     healthMultiplier: 1,
  //     hasAccountBorrowLimit: false,
  //     hasWithdrawableLimit: false,
  //     localBorrowAmountLimit: false,
  //     hasCrvClaimLogic: false,
  //     oracleInfo: {
  //       kind: "PYTH",
  //       feedIds: [
  //         "0xf67b033925d73d43ba4401e00308d9b0f26ab4fbd1250e8b5407b9eaade7e1f4",
  //       ],
  //     },
  //     isBeraDesign: true,
  //     isMimHoney: true,
  //     isNew: true,
  //     weight: 4
  //   },
  //   contract: {
  //     name: "CauldronV4",
  //     address: "0xFc4de12E0C25e442E10260dE575a7994e5E68E20",
  //     abi: poolsAbi.CauldronV4,
  //   },
  //   collateralInfo: {
  //     name: "MagicKodiak Vault",
  //     decimals: 18,
  //     address: "0x548eAf30BAD1B4f697fBAC88712fc8148Dc0aA75",
  //     abi: tokensAbi.MagicKodiakVault,
  //   },
  //   mimInfo,
  //   wrapInfo: {
  //     isHiddenWrap: true,
  //     useUnwrappedByDefault: true,
  //     unwrappedToken: {
  //       name: "MIM/HONEY LP",
  //       icon: useImage(`assets/images/tokens/MIM-HONEY.png`),
  //       address: "0x933b2e6a71edBF11BBA75C5Ad241D246b145E0b0",
  //       abi: tokensAbi.MagicKodiakVault,
  //     },
  //     wrapper: {
  //       address: "0x6D1EAAdeD97DC9d49BCb08Bdcd15EAcb08da42e4",
  //       abi: degenBoxERC4626Wrapper,
  //     },
  //   },
  //   leverageInfo: {
  //     address: "0xA3372CD2178c52fdCB1f6e4c4E93014B4dB3B20d",
  //     abi: MagicKodiakIslandLevSwapperAbi,
  //   },
  //   deleverageInfo: {
  //     address: "0x6E4358c889bb7871061904Be31Fe47C3B8b7F442",
  //     abi: MagicKodiakIslandSwapperAbi,
  //   },
  // },
  {
    icon: useImage(`assets/images/tokens/BEX_WBERA_WETH.png`),
    name: "WETH/BERA",
    chainId: 80094,
    id: 2,
    liquidationFee: 8,
    mcr: 75,
    borrowFee: 0.5,
    version: 4,
    cauldronSettings: {
      is0xSwap: true,
      isSwappersActive: true,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      oracleInfo: {
        kind: "PYTH",
        feedIds: [
          "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
          "0x962088abcfdbdb6e30db2e340c8cf887d9efb311b1f2f17b155a63dbb6d40265",
        ],
      },
      isBeraDesign: true,
      isBeraBex: true,
      isNew: true,
      weight: 4,
      isAprExist: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0xbE75E97a0B5DC80472BC266cbBab30656C8DDCfE",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "Magic WETH/BERA",
      decimals: 18,
      address: "0x1E2aFbf7dC81A80Ab2B359B16333E567e2528F1B",
      abi: tokensAbi.MagicKodiakVault,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      useUnwrappedByDefault: true,
      unwrappedToken: {
        name: "WETH/BERA LP",
        icon: useImage(`assets/images/tokens/BEX_WBERA_WETH.png`),
        address: "0xDd70A5eF7d8CfE5C5134b5f9874b09Fb5Ce812b4",
        abi: tokensAbi.BexWeightedPool,
      },
      wrapper: {
        address: "0x59Be9FcB06cC9C8BEe44b9861131D4614fB11bda",
        abi: degenBoxERC4626Wrapper,
      },
    },
    leverageInfo: {
      address: "0xE9c057D6D4EDC8935c931Ec307DF225A1C2D04Ff",
      abi: MagicKodiakIslandLevSwapperAbi,
    },
    deleverageInfo: {
      address: "0x1F69c1ca2C8Fc0212C26830E7736AE8f392F09ca",
      abi: MagicKodiakIslandSwapperAbi,
    },
  },
  {
    icon: useImage(`assets/images/tokens/BEX_WBERA_WBTC.png`),
    name: "WBTC/BERA",
    chainId: 80094,
    id: 3,
    liquidationFee: 8,
    mcr: 75,
    borrowFee: 0.5,
    version: 4,
    cauldronSettings: {
      is0xSwap: true,
      isSwappersActive: true,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      oracleInfo: {
        kind: "PYTH",
        feedIds: [
          "0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33",
          "0x962088abcfdbdb6e30db2e340c8cf887d9efb311b1f2f17b155a63dbb6d40265",
        ],
      },
      isBeraDesign: true,
      isBeraBex: true,
      isNew: true,
      weight: 4,
      isAprExist: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0xE6D346F2f35c31442Dc52eFfF56FadC60dd3fb9E",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "Magic WBTC/BERA",
      decimals: 18,
      address: "0x9b0E08665be0bD1bC9DA04d39234110AFbE795BE",
      abi: tokensAbi.MagicKodiakVault,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      useUnwrappedByDefault: true,
      unwrappedToken: {
        name: "WBTC/BERA LP",
        icon: useImage(`assets/images/tokens/BEX_WBERA_WBTC.png`),
        address: "0x38fdD999Fe8783037dB1bBFE465759e312f2d809",
        abi: tokensAbi.BexWeightedPool,
      },
      wrapper: {
        address: "0xF80a7b98b59e7F71BAa149990bAA6044728321bb",
        abi: degenBoxERC4626Wrapper,
      },
    },
    leverageInfo: {
      address: "0x177a24B427876F61983CCe0dD37608611e7de3f7",
      abi: MagicKodiakIslandLevSwapperAbi,
    },
    deleverageInfo: {
      address: "0x991536BF23fa40B578Fc3e1e3725E51D1bF889F3",
      abi: MagicKodiakIslandSwapperAbi,
    },
  },
];

export default config;
