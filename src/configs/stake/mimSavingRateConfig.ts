import type { Address } from "viem";
import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import lockingMultiRewardsAbi from "@/abis/stake/lockingMultiRewardsAbi";

export type MimSavingRateConfig = {
  chainId: number;
  lockingMultiRewardsContract: {
    address: Address;
    abi: any;
  };
  stakingToken: {
    name: string;
    icon: string;
    decimals: number;
    contract: {
      address: Address;
      abi: any;
    };
  };
  rewardTokens: RewardTokenConfig[]
};

export type RewardTokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: {
    address: Address;
    abi: any;
  };
};

export const mimSavingRateConfig: MimSavingRateConfig[] = [
  {
    chainId: 42161,
    lockingMultiRewardsContract: {
      address: "0xe06d95f8b8b2AE222690E9Fe5AC0FF2FeBBD73B6",
      abi: lockingMultiRewardsAbi,
    },
    stakingToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
        abi: tokensAbi.MIM,
      },
    },
    rewardTokens: [
      {
      name: "ARB",
      icon: useImage(`assets/images/tokens/AETH.png`),
      decimals: 18,
      contract: {
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        abi: tokensAbi.ARB,
      },
    },
    {
      name: "Spell",
      icon: useImage(`assets/images/tokens/SPELL.png`),
      decimals: 18,
      contract: {
        address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
        abi: tokensAbi.SPELL,
      },
    },
  ]
  },
];
