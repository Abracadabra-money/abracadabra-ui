import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import swapAbi from "@/utils/abi/swap";
import reverseSwapAbi from "@/utils/abi/reverseSwap";
import degenBoxERC20VaultWrapper from "@/utils/abi/lp/degenBoxERC20VaultWrapper";

export default [
  {
    icon: require(`@/assets/images/tokens/WETH.png`),
    name: "WETH",
    contractChain: 42161,
    id: 1,
    stabilityFee: 5,
    interest: 0.5,
    ltv: 85,
    borrowFee: 0.5,
    isSwappersActive: true,
    cauldronSettings: {
      isDegenBox: false,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: true,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      leverageMax: 15,
      dynamicBorrowAmountLimit: 1000000,
      isCollateralClaimable: false,
      claimCrvReward: false,
    },
    contract: {
      name: "CauldronV2Flat",
      address: "0xC89958B03A55B5de2221aCB25B58B89A000215E6",
      abi: poolsAbi.CauldronV2Flat,
    },
    token: {
      name: "WETH",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      abi: tokensAbi.wETH,
    },
    pairToken: {
      name: "MIM",
      icon: require(`@/assets/images/tokens/MIM.png`),
      decimals: 18,
      address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      abi: tokensAbi.MIM,
    },
    swapContractInfo: {
      address: "0xC9faCFA2fC50C9A30C77a2ad14E2dB107d591918",
      abi: swapAbi,
    },
    reverseSwapContractInfo: {
      address: "0x4c56DbCC056655b8813539aF9C819ae128c07e17",
      abi: reverseSwapAbi,
    },
  },
  {
    icon: require(`@/assets/images/tokens/GLP.png`),
    name: "GLP",
    contractChain: 42161,
    id: 2,
    stabilityFee: 7.5,
    interest: 0,
    ltv: 75,
    borrowFee: 0,
    isSwappersActive: false,
    cauldronSettings: {
      isDegenBox: true,
      strategyLink:
        "https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/u0vFLaZaHrstsu7V-pcs58ufFm7s6Sdw9coKgOfEkXM",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      leverageMax: 15,
      dynamicBorrowAmountLimit: false,
      isCollateralClaimable: false,
      claimCrvReward: false,
    },
    contract: {
      name: "CauldronV4",
      address: "0x5698135CA439f21a57bDdbe8b582C62f090406D5",
      abi: poolsAbi.CauldronV4,
    },
    token: {
      name: "abra-wsGlp",
      decimals: 18,
      address: "0x3477Df28ce70Cecf61fFfa7a95be4BEC3B3c7e75",
      abi: tokensAbi.abraWsGlp,
    },
    lpLogic: {
      name: "GLP",
      defaultToken: false,
      lpAddress: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
      lpAbi: tokensAbi.sGLP,
      tokenWrapper: "0xDd45c6614305D705a444B3baB0405D68aC85DbA5",
      tokenWrapperAbi: degenBoxERC20VaultWrapper,
    },
    pairToken: {
      name: "MIM",
      icon: require(`@/assets/images/tokens/MIM.png`),
      decimals: 18,
      address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      abi: tokensAbi.MIM,
    },
  },
];
