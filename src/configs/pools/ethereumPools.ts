import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import { RewardPointsTypes, type PoolConfig } from "@/configs/pools/types";
import MultiRewardsAbi from "@/abis/MultiRewards";

const ethereumPools: Array<PoolConfig> = [
  {
    id: "0x95b485615c193cf75582b70ABdB08bc7172a80fe",
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
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
      rewardPointsType: RewardPointsTypes.Elixir,
    },
    initialParameters: {
      I: 1000000000000000000n,
      K: 250000000000000n,
      lpFeeRate: 500000000000000n,
    },
  },
  {
    id: 2,
    chainId: 1,
    name: "MIM / USD0",
    icon: useImage(`assets/images/tokens/MIM-USD0.png`),
    decimals: 18,
    contract: {
      address: "0x6f9F9ea9c06c7D928a2fFbbCc5542b18188488E9",
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
      name: "USD0",
      icon: useImage(`assets/images/tokens/USD0.png`),
      contract: {
        address: "0x73A15FeD60Bf67631dC6cd7Bc5B6e8da8190aCF5",
        abi: erc20Abi,
      },
      decimals: 18,
      isPopular: false,
    },
    rewardTokens: [],
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default ethereumPools;
