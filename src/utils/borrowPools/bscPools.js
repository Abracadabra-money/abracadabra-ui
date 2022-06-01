import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import swapAbi from "@/utils/abi/swap";
import reverseSwapAbi from "@/utils/abi/reverseSwap";

export default [
  {
    icon: require(`@/assets/images/tokens/BNB.png`),
    name: "WBNB",
    contractChain: 56,
    id: 1,
    stabilityFee: 10,
    interest: 2,
    ltv: 85,
    borrowFee: 0.5,
    isSwappersActive: false,
    cauldronSettings: {
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: true,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: true,
      leverageMax: 15,
      dynamicBorrowAmountLimit: 1000000,
      isCollateralClaimable: false,
      claimCrvReward: false,
    },
    contract: {
      name: "CauldronV2MultiChain",
      address: "0x692CF15F80415D83E8c0e139cAbcDA67fcc12C90",
      abi: poolsAbi.CauldronV2Multichain,
    },
    token: {
      name: "WBNB",
      decimals: 18,
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      abi: tokensAbi.WBNB,
    },
    pairToken: {
      name: "MIM",
      decimals: 18,
      address: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      abi: tokensAbi.MIM,
    },
    swapContractInfo: {
      address: "0x197De282d7b5cEFfFD8f8B0196c30e8401593CF6",
      abi: swapAbi,
    },
    reverseSwapContractInfo: {
      address: "0x1D7C1C99045C1c776607F8C1eC9DDd27a2d319D3",
      abi: reverseSwapAbi,
    },
  },
  {
    icon: require(`@/assets/images/tokens/CAKE.png`),
    name: "CAKE",
    contractChain: 56,
    id: 2,
    stabilityFee: 12.5,
    interest: 3,
    ltv: 75,
    borrowFee: 0.5,
    isSwappersActive: false,
    cauldronSettings: {
      isDegenBox: true,
      strategyLink:
        "https://medium.com/abracadabra-money/our-cake-degenbox-strategy-68be5f34527",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: true,
      leverageMax: 15,
      dynamicBorrowAmountLimit: 1000000,
      isCollateralClaimable: false,
      claimCrvReward: false,
    },
    contract: {
      name: "CauldronV2MultiChain",
      address: "0xF8049467F3A9D50176f4816b20cDdd9bB8a93319",
      abi: poolsAbi.CauldronV2Multichain,
    },
    token: {
      name: "CAKE",
      decimals: 18,
      address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      abi: tokensAbi.CAKE,
    },
    pairToken: {
      name: "MIM",
      decimals: 18,
      address: "0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba",
      abi: tokensAbi.MIM,
    },
    swapContractInfo: {
      address: "0x197De282d7b5cEFfFD8f8B0196c30e8401593CF6",
      abi: swapAbi,
    },
    reverseSwapContractInfo: {
      address: "0x1D7C1C99045C1c776607F8C1eC9DDd27a2d319D3",
      abi: reverseSwapAbi,
    },
  },
];
