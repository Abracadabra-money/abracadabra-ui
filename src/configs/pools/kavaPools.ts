import erc20Abi from "@/abis/farm/erc20Abi";
import { useImage } from "@/helpers/useImage";
import BlastMagicLpAbi from "@/abis/BlastMagicLP";
import type { PoolConfig } from "@/configs/pools/types";

const kavaPools: Array<PoolConfig> = [
  {
    id: 1,
    chainId: 2222,
    name: "MIM / USDt",
    icon: useImage(`assets/images/tokens/MIM.png`),
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
      mainColor: "#C9E5FF",
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
      mainColor: "#53AE94",
      isPopular: true,
    },
    settings: {
      isNew: true,
      isDeprecated: false,
      isMim: true,
    },
  },
];

export default kavaPools;
