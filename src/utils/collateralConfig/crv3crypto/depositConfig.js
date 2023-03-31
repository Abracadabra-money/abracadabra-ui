import depositTokenAbi from "@/utils/abi/tokensAbi/crv3crypto";
import mainTokenAbi from "@/utils/abi/tokensAbi/stkcvxcrv3crypto";
import stakeTokenAbi from "@/utils/abi/tokensAbi/cvxcrv3crypto";

const useImage = ((url) => {
  return new URL(`/src/${url}`, import.meta.url).href;
});

export default {
  depositToken: {
    name: "3Crypto2",
    icon: useImage(`assets/images/tokens/3Crypto2.png`),

    decimals: 18,
    address: "0xc4AD29ba4B3c580e6D59105FFf484999997675Ff",
    abi: depositTokenAbi,
  },
  stakeToken: {
    name: "Tricripto2",
    decimals: 18,
    address: "0x903C9974aAA431A765e60bC07aF45f0A1B3b61fb",
    abi: stakeTokenAbi,
  },
  mainToken: {
    name: "cvxtricrypto2",
    icon: useImage(`assets/images/tokens/Convex-Curve3.png`),
    decimals: 18,
    address: "0x5958A8DB7dfE0CC49382209069b00F54e17929C2",
    abi: mainTokenAbi,
  },
};
