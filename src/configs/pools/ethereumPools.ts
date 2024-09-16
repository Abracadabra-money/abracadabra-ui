import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";
import MultiRewardsAbi from "@/abis/MultiRewards";

const ethereumPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 1,
    name: "MIM / deUSD",
    icon: useImage(`assets/images/tokens/MIM-deUSD.png`),
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
      isPopular: true,
    },
    stakeContract: {
      address: "0xaFe0BB622D83fDBF86686E097AeC9a4D9F2c47db",
      abi: MultiRewardsAbi,
    },
    rewardTokens: [
      // {
      //   name: "bSPELL",
      //   icon: useImage(`assets/images/tokens/SPELL_2.png`),
      //   decimals: 18,
      //   contract: {
      //     address: "0x34D239C8672B814D8F31F1a3e7e72702b6516D28",
      //     abi: erc20Abi,
      //   },
      // },
    ],
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default ethereumPools;
