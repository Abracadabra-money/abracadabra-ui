import depositTokenAbi from "@/utils/abi/tokensAbi/MEMO";
import mainTokenAbi from "@/utils/abi/tokensAbi/wMEMO";
import { useImage } from "@/helpers/useImage";

const useImage = ((url) => {
  return new URL(`/src/${url}`, import.meta.url).href;
});

export default {
  depositToken: {
    name: "MEMO",
    icon: useImage(`assets/images/tokens/MEMO.png`),
    decimals: 9,
    address: "0x136Acd46C134E8269052c62A67042D6bDeDde3C9",
    abi: depositTokenAbi,
  },
  mainToken: {
    name: "wMEMO",
    icon: useImage(`assets/images/tokens/MEMO.png`),
    decimals: 18,
    address: "0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b",
    abi: mainTokenAbi,
  },
};
