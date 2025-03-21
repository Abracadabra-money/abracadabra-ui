import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import MultiRewardsAbi from "@/abis/MultiRewards";
import type { PoolConfig, AdditionalPoolConfig } from "@/configs/pools/types";

const kavaPools: Array<PoolConfig | AdditionalPoolConfig> = [
  {
    id: "0x10C9FCDa1655b7A55250AdCEe06f0B6e83F473c1",
    chainId: 2222,
    name: "MIM / USDT",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x10C9FCDa1655b7A55250AdCEe06f0B6e83F473c1",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0x471EE749bA270eb4c1165B5AD95E614947f6fCeb",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    quoteToken: {
      name: "USDt",
      icon: useImage(`assets/images/tokens/USDT.png`),
      contract: {
        address: "0x919C1c267BC06a7039e03fcc2eF738525769109c",
        abi: erc20Abi,
      },
      decimals: 6,
      isPopular: true,
    },
    stakeContract: {
      address: "0xcF4f8E9A113433046B990980ebce5c3fA883067f",
      abi: MultiRewardsAbi,
    },
    rewardTokens: [
      {
        name: "wKAVA",
        icon: useImage(`assets/images/tokens/KAVA.png`),
        decimals: 18,
        contract: {
          address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
          abi: erc20Abi,
        },
      },
    ],
    settings: {
      isNew: false,
      isDeprecated: false,
      isMim: true,
    },
    //todo: dummy info. kavascan contract didnt work
    initialParameters: {
      I: 1000000000000000000n,
      K: 250000000000000n,
      lpFeeRate: 500000000000000n,
    },
  },
];

export default kavaPools;
