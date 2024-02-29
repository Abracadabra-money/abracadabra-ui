import { useImage } from "@/helpers/useImage";
import type { BlastStakeConfig } from "./types";

const BlastOnboardingAddress = "0xFa85b0BB658d519247494b6020Cae6E65f572950";
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
        address: "0x4200000000000000000000000000000000000022",
        abi: erc20Abi,
      },
    },
    {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0x0eb13D9C49C31B57e896c1637766E9EcDC1989CD",
        abi: erc20Abi,
      },
    },
  ],
};
