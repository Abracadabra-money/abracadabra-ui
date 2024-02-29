import { useImage } from "@/helpers/useImage";
import type { BlastStakeConfig } from "./types";

const BlastOnboardingAddress = "0xa64B73699Cc7334810E382A4C09CAEc53636Ab96";
import BlastOnboardingAbi from "@/abis/BlastOnboarding";

import erc20Abi from "@/abis/farm/erc20Abi";

export const blastStakeConfig: BlastStakeConfig = {
  contract: {
    address: BlastOnboardingAddress,
    abi: BlastOnboardingAbi,
  },
  tokens: [
    {
      name: "USDb",
      icon: useImage(`assets/images/tokens/USDB.png`),
      decimals: 18,
      contract: {
        address: "0x4300000000000000000000000000000000000003",
        abi: erc20Abi,
      },
    },
    {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1",
        abi: erc20Abi,
      },
    },
  ],
};
