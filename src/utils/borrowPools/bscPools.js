import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import swapAbi from "@/utils/abi/swap";
import reverseSwapAbi from "@/utils/abi/reverseSwap";

export default [
  {
    name: "wBNB",
    icon: require(`@/assets/images/tokensIcon/Token_BNB.svg`),
    contractChain: "0x38",
    id: 1,
    isDepreciated: false,
    isSwappersActive: false,
    acceptUseDefaultBalance: true,
    isDegenBox: true,
    contract: {
      name: "CauldronV2MultiChain",
      address: "0x692CF15F80415D83E8c0e139cAbcDA67fcc12C90",
      abi: poolsAbi.CauldronV2Multichain,
    },
    token: {
      name: "wBNB",
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
    stabilityFee: 10,
    interest: 2,
    borrowFee: 0.5,
    ltv: 85,
    initialMax: 20,
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
    name: "CAKE",
    icon: require(`@/assets/images/tokensIcon/Token_CAKE.svg`),
    contractChain: "0x38",
    id: 2,
    isDepreciated: false,
    isSwappersActive: false,
    acceptUseDefaultBalance: false,
    isDegenBox: true,
    strategyLink:
      "https://medium.com/@abracadabramoney/our-cake-degenbox-strategy-68be5f34527",

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
    stabilityFee: 12.5,
    interest: 3,
    borrowFee: 0.5,
    ltv: 75,
    initialMax: 20,
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
