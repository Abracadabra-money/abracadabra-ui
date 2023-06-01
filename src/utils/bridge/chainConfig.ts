import { useImage } from "@/helpers/useImage";

const ethIcon = useImage(`assets/images/bridge/ETH.png`);
const fantomIcon = useImage(`assets/images/bridge/FTM.png`);
const polygonIcon = useImage(`assets/images/bridge/MATIC.png`);
const binanceIcon = useImage(`assets/images/bridge/BNB.png`);
const avalancheIcon = useImage(`assets/images/bridge/AVAX.png`);
const arbitrumIcon = useImage(`assets/images/bridge/Arbitrum.png`);
const optimismIcon = useImage(`assets/images/networks/optimism-icon.svg`);

export type ChainConfig = {
  name: string;
  icon: string;
  chainId: number;
};

const config: Array<ChainConfig> = [
  {
    name: "ETH",
    icon: ethIcon,
    chainId: 1,
  },
  {
    name: "OP",
    icon: optimismIcon,
    chainId: 10,
  },
  {
    name: "BSC",
    icon: binanceIcon,
    chainId: 56,
  },
  {
    name: "MATIC",
    icon: polygonIcon,
    chainId: 137,
  },
  {
    name: "FTM",
    icon: fantomIcon,
    chainId: 250,
  },
  {
    name: "Moonriver",
    icon: optimismIcon,
    chainId: 1285,
  },
  {
    name: "AETH",
    icon: arbitrumIcon,
    chainId: 42161,
  },
  {
    name: "AVAX",
    icon: avalancheIcon,
    chainId: 43114,
  },
];

export default config;
