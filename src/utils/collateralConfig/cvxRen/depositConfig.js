import depositTokenAbi from "@/utils/abi/tokensAbi/crvRenWBTC";
import mainTokenAbi from "@/utils/abi/tokensAbi/cvxRen";

export default {
  depositToken: {
    name: "renCrv",
    icon: require(`@/assets/images/tokens/Curve-Ren.png`),
    decimals: 18,
    address: "0x49849C98ae39Fff122806C06791Fa73784FB3675",
    abi: depositTokenAbi,
  },
  mainToken: {
    name: "cvxrenCrv",
    icon: require(`@/assets/images/tokens/Convex-Bitcoin.png`),
    decimals: 18,
    address: "0xB65eDE134521F0EFD4E943c835F450137dC6E83e",
    abi: mainTokenAbi,
  },
};
