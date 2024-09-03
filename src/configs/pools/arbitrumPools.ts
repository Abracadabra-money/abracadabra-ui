import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";
import MultiRewardsAbi from "@/abis/MultiRewards";

const arbitrumPools: Array<PoolConfig> = [
  // {
  //   id: 1,
  //   chainId: 42161,
  //   name: "WETH / WBTC",
  //   icon: useImage(`assets/images/tokens/BTC-WETH.png`),
  //   decimals: 18,
  //   contract: {
  //     address: "0x5895bff185127a01a333cbea8e53dcf172c13f35",
  //     abi: BlastMagicLpAbi,
  //   },
  //   baseToken: {
  //     name: "WETH",
  //     icon: useImage(`assets/images/tokens/WETH.png`),
  //     decimals: 18,
  //     contract: {
  //       address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  //       abi: erc20Abi,
  //     },
  //     isPopular: true,
  //   },
  //   quoteToken: {
  //     name: "WBTC",
  //     icon: useImage(`assets/images/tokens/WBTC.png`),
  //     contract: {
  //       address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  //       abi: erc20Abi,
  //     },
  //     decimals: 8,
  //     isPopular: true,
  //   },
  //   settings: {
  //     isNew: true,
  //     isDeprecated: false,
  //     isMim: true,
  //   },
  // },
  {
    id: 1,
    chainId: 42161,
    name: "MIM / USDT",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x236b9ee6f185dc8b70d8bd3649f40ec37688c1ab",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    quoteToken: {
      name: "USDt",
      icon: useImage(`assets/images/tokens/USDT.png`),
      contract: {
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        abi: erc20Abi,
      },
      decimals: 6,
      isPopular: true,
    },
    stakeContract: {
      address: "0xc30911b52b5752447aB08615973e434c801CD652",
      abi: MultiRewardsAbi,
    },
    rewardTokens: [
      {
        name: "SPELL",
        icon: useImage(`assets/images/tokens/SPELL_2.png`),
        decimals: 18,
        contract: {
          address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
          abi: erc20Abi,
        },
      },
      {
        name: "ARB",
        icon: useImage(`assets/images/tokens/ARB.png`),
        decimals: 18,
        contract: {
          address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
          abi: erc20Abi,
        },
      },
    ],
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
    initialParameters: {
      I: 1000000n,
      K: 250000000000000n,
      lpFeeRate: 500000000000000n
    }
  },
  {
    id: 2,
    chainId: 42161,
    name: "MIM / USDC",
    icon: useImage(`assets/images/tokens/MIM-USDC.png`),
    decimals: 18,
    contract: {
      address: "0x8279699D397ED22b1014fE4D08fFD7Da7B3374C0",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
        abi: erc20Abi,
      },
      isPopular: true,
    },
    quoteToken: {
      name: "USDC",
      icon: useImage(`assets/images/tokens/USDC.png`),
      contract: {
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        abi: erc20Abi,
      },
      decimals: 6,
      isPopular: true,
    },
    stakeContract: {
      address: "0x280c64c4C4869CF2A6762EaDD4701360C1B11F97",
      abi: MultiRewardsAbi,
    },
    rewardTokens: [
      {
        name: "SPELL",
        icon: useImage(`assets/images/tokens/SPELL_2.png`),
        decimals: 18,
        contract: {
          address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
          abi: erc20Abi,
        },
      },
      {
        name: "ARB",
        icon: useImage(`assets/images/tokens/ARB.png`),
        decimals: 18,
        contract: {
          address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
          abi: erc20Abi,
        },
      },
    ],
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
    initialParameters: {
      I: 1000000n,
      K: 250000000000000n,
      lpFeeRate: 500000000000000n
    }
  },
];

export default arbitrumPools;
