import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import swapAbi from "@/utils/abi/swap";
import reverseSwapAbi from "@/utils/abi/reverseSwap";

export default [
  {
    name: "ETH",
    icon: require(`@/assets/images/tokensIcon/Token_ETH.svg`),
    contractChain: "0xa4b1",
    id: 1,
    isDepreciated: false,
    isSwappersActive: true,
    acceptUseDefaultBalance: true,
    contract: {
      name: "CauldronV2Flat",
      address: "0xC89958B03A55B5de2221aCB25B58B89A000215E6",
      abi: poolsAbi.CauldronV2Flat,
    },
    token: {
      name: "wETH",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",

      abi: tokensAbi.wETH,
    },
    pairToken: {
      name: "MIM",
      decimals: 18,
      address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      abi: tokensAbi.MIM,
    },
    stabilityFee: 5,
    interest: 0.5,
    borrowFee: 0.5,
    ltv: 85,
    initialMax: 15,
    swapContractInfo: {
      address: "0xC9faCFA2fC50C9A30C77a2ad14E2dB107d591918",
      abi: swapAbi,
    },
    reverseSwapContractInfo: {
      address: "0x4c56DbCC056655b8813539aF9C819ae128c07e17",
      abi: reverseSwapAbi,
    },
  },
];
