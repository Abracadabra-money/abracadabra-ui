import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import zeroXLevSwapper from "@/utils/abi/zeroXLevSwapper.js";
import zeroXLiqSwapper from "@/utils/abi/zeroXLiqSwapper";
import lptokenWrapperAbi from "@/utils/abi/lp/tokenWrapeerAbi";
import lpAbi from "@/utils/abi/lp/lpAbi";
import abiERC20 from "@/utils/zeroXSwap/abi/abiERC20";
import EACAggregatorProxyAbi from "@/utils/abi/EACAggregatorProxy";

const useImage = ((url) => {
  return new URL(`/src/${url}`, import.meta.url).href;
});

export default [
  {
    icon: useImage(`assets/images/tokens/OP_USDC.png`),
    name: "Velodrome Volatile OP/USDC",
    contractChain: 10,
    id: 1,
    stabilityFee: 8,
    interest: 2,
    ltv: 70,
    borrowFee: 0,
    is0xSwap: true,
    isSwappersActive: true,
    cauldronSettings: {
      isDegenBox: true,
      strategyLink: "https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/Z9bhlbcfDTByubuwSzCahPMhpvYxnOaC0sBYU12Eh_Y",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: true,
      leverageMax: 15,
      localBorrowAmountLimit: false,
      isCollateralClaimable: false,
      claimCrvReward: false,
    },
    contract: {
      name: "CauldronV3_2",
      address: "0x68f498C230015254AFF0E1EB6F85Da558dFf2362",
      abi: poolsAbi.CauldronV3_2,
    },
    token: {
      name: "wOP/USDC",
      decimals: 18,
      address: "0x6eb1709e0b562097bf1cc48bc6a378446c297c04",
      abi: tokensAbi.opUSDC,
    },
    token0: {
      address: "0x4200000000000000000000000000000000000042",
      abi: abiERC20,
    },
    token1: {
      address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      abi: abiERC20,
    },
    lpLogic: {
      name: "OP/USDC",
      defaultToken: false,
      lpAddress: "0x47029bc8f5CBe3b464004E87eF9c9419a48018cd",
      lpAbi,
      tokenWrapper: "0x1fff78fd2e139bc1315711dd3ea176bc7028635a",
      tokenWrapperAbi: lptokenWrapperAbi,
    },
    pairToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      address: "0xB153FB3d196A8eB25522705560ac152eeEc57901",
      abi: tokensAbi.MIM,
    },
    chainlinks: {
      token0: "0x0d276fc14719f9292d5c1ea2198673d1f4269246",
      token1: "0x16a9fa2fda030272ce99b29cf780dfa30361e0f3",
      abi: EACAggregatorProxyAbi,
    },
    swapContractInfo: {
      address: "0xf76DA2D3656E1cC5Ca2Fbb9663C89f7d8AAe20Fc",
      abi: zeroXLevSwapper,
    },
    reverseSwapContractInfo: {
      address: "0x79533F85479e04d2214305638B6586b724beC951",
      abi: zeroXLiqSwapper,
    },
  },
  // {
  //   icon: useImage(`assets/images/tokens/Stargate-USDC.png`),
  //   name: "Stargate USDC",
  //   contractChain: 10,
  //   id: 2,
  //   stabilityFee: 0.5,
  //   interest: 0,
  //   ltv: 95,
  //   borrowFee: 0,
  //   isSwappersActive: true,
  //   cauldronSettings: {
  //     isDegenBox: true,
  //     strategyLink: false,
  //     isDepreciated: false,
  //     acceptUseDefaultBalance: false,
  //     healthMultiplier: 1,
  //     hasAccountBorrowLimit: false,
  //     hasWithdrawableLimit: false,
  //     leverageMax: 15,
  //     localBorrowAmountLimit: false,
  //     isCollateralClaimable: false,
  //     claimCrvReward: false,
  //   },
  //   contract: {
  //     name: "CauldronV3_2",
  //     address: "0x0981a77C825CBF9fced939e05f12387Ef1955b90",
  //     abi: poolsAbi.CauldronV3_2,
  //   },
  //   token: {
  //     name: "S*USDC",
  //     decimals: 6,
  //     address: "0xdecc0c09c3b5f6e92ef4184125d5648a66e35298",
  //     abi: tokensAbi.sUSDC,
  //   },
  //   pairToken: {
  //     name: "MIM",
  //     icon: useImage(`assets/images/tokens/MIM.png`),
  //     decimals: 18,
  //     address: "0xB153FB3d196A8eB25522705560ac152eeEc57901",
  //     abi: tokensAbi.MIM,
  //   },
  //   swapContractInfo: {
  //     address: "0x35467BBd152a0f4d9166E649728c101fe4806EAa",
  //     abi: zeroXLevSwapper,
  //   },
  //   reverseSwapContractInfo: {
  //     address: "0x3e6ef9E97147C266c5bddeF03E7dfba7a167d853",
  //     abi: zeroXLiqSwapper,
  //   },
  // },
];