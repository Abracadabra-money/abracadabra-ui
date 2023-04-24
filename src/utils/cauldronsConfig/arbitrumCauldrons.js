import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import swapAbi from "@/utils/abi/swap";
import reverseSwapAbi from "@/utils/abi/reverseSwap";
import degenBoxERC20VaultWrapper from "@/utils/abi/lp/degenBoxERC20VaultWrapper";
import degenBoxERC4626Wrapper from "@/utils/abi/lp/DegenBoxERC4626Wrapper";
import magicGlpLevSwapperAbi from "@/utils/abi/lp/MagicGlpLevSwapper";
import magicGlpSwapperAbi from "@/utils/abi/lp/MagicGlpSwapper";
import { useImage } from "@/helpers/useImage";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
  abi: tokensAbi.MIM,
};

export default [
  {
    icon: useImage(`assets/images/tokens/WETH.png`),
    name: "WETH",
    chainId: 42161,
    id: 1,
    liquidationFee: 5,
    mcr: 85,
    borrowFee: 0.5,
    cauldronSettings: {
      isSwappersActive: true,
      isDegenBox: false,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: true,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
    },
    contract: {
      name: "CauldronV2Flat",
      address: "0xC89958B03A55B5de2221aCB25B58B89A000215E6",
      abi: poolsAbi.CauldronV2Flat,
    },
    collateralInfo: {
      name: "WETH",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      abi: tokensAbi.wETH,
    },
    mimInfo,
    leverageInfo: {
      address: "0xC9faCFA2fC50C9A30C77a2ad14E2dB107d591918",
      abi: swapAbi,
    },
    deleverageInfo: {
      address: "0x4c56DbCC056655b8813539aF9C819ae128c07e17",
      abi: reverseSwapAbi,
    },
  },
  {
    icon: useImage(`assets/images/tokens/GLP.png`),
    name: "GLP",
    chainId: 42161,
    id: 2,
    liquidationFee: 7.5,
    mcr: 75,
    borrowFee: 0,
    cauldronSettings: {
      isSwappersActive: false,
      isDegenBox: true,
      strategyLink:
        "https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/u0vFLaZaHrstsu7V-pcs58ufFm7s6Sdw9coKgOfEkXM",
      isDepreciated: true,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
    },
    contract: {
      name: "CauldronV4",
      address: "0x5698135CA439f21a57bDdbe8b582C62f090406D5",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "abra-wsGlp",
      decimals: 18,
      address: "0x3477Df28ce70Cecf61fFfa7a95be4BEC3B3c7e75",
      abi: tokensAbi.abraWsGlp,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      unwrappedToken: {
        name: "GLP",
        icon: useImage(`assets/images/tokens/GLP.png`),
        address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
        abi: tokensAbi.sGLP,
      },
      wrapper: {
        address: "0xDd45c6614305D705a444B3baB0405D68aC85DbA5",
        abi: degenBoxERC20VaultWrapper,
      },
    },
  },
  {
    icon: useImage(`assets/images/tokens/mGlpToken.png`),
    name: "MagicGLP",
    chainId: 42161,
    id: 3,
    liquidationFee: 7.5,
    mcr: 75,
    borrowFee: 0,
    cauldronSettings: {
      isSwappersActive: true,
      is0xSwap: true,
      isDegenBox: true,
      strategyLink:
        "https://abracadabramoney.gitbook.io/learn/intro/stake/mglp",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: true,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,

      isNew: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0x726413d7402fF180609d0EBc79506df8633701B1",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "magicGLP",
      decimals: 18,
      address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
      abi: tokensAbi.magicGLP,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: false,
      unwrappedToken: {
        name: "GLP",
        icon: useImage(`assets/images/tokens/GLP.png`),
        address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
        abi: tokensAbi.sGLP,
      },
      wrapper: {
        address: "0x565adE5536Ab84018e00d6d7f56E7a300717c10b",
        abi: degenBoxERC4626Wrapper,
      },
    },
    leverageInfo: {
      address: "0xDe36DEf82F9da4493925407e37E6548d5D9bd7eD",
      abi: magicGlpLevSwapperAbi,
    },
    deleverageInfo: {
      address: "0xeB07b275dCe4b32FA3bbF505104C26E9A3B478d9",
      abi: magicGlpSwapperAbi,
    },
  },
];
