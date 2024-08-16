import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";
import MultiRewardsAbi from "@/abis/MultiRewards";

const ethereumPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 1,
    name: "MIM / USDT",
    icon: useImage(`assets/images/tokens/MIM-USDT.png`),
    decimals: 18,
    contract: {
      address: "0x95b485615c193cf75582b70ABdB08bc7172a80fe",
      abi: BlastMagicLpAbi,
    },
    baseToken: {
      name: "MIM",
      icon: useImage(`assets/images/tokens/MIM.png`),
      decimals: 18,
      contract: {
        address: "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
        abi: erc20Abi,
      },
      mainColor: "#C9E5FF",
      isPopular: true,
    },
    quoteToken: {
      name: "deUSD",
      icon: useImage(`assets/images/tokens/deUSD.png`),
      contract: {
        address: "0x15700B564Ca08D9439C58cA5053166E8317aa138",
        abi: erc20Abi,
      },
      decimals: 18,
      mainColor: "#53AE94",
      isPopular: true,
    },
    // stakeContract: {
    //   address: "0xc30911b52b5752447aB08615973e434c801CD652",
    //   abi: MultiRewardsAbi,
    // },
    // rewardTokens: [
    //   {
    //     name: "SPELL",
    //     icon: useImage(`assets/images/tokens/SPELL_2.png`),
    //     decimals: 18,
    //     contract: {
    //       address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
    //       abi: erc20Abi,
    //     },
    //   },
    //   {
    //     name: "ARB",
    //     icon: useImage(`assets/images/tokens/ARB.png`),
    //     decimals: 18,
    //     contract: {
    //       address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    //       abi: erc20Abi,
    //     },
    //   },
    // ],
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default ethereumPools;
