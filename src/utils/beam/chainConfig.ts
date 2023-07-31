import { useImage } from "@/helpers/useImage";

const ethIcon = useImage(`assets/images/networks/ethereum.svg`);
const binanceIcon = useImage(`assets/images/networks/binance.svg`);
const fantomIcon = useImage(`assets/images/networks/fantom.svg`);
const avalancheIcon = useImage(`assets/images/networks/avalanche.svg`);
const arbitrumIcon = useImage(`assets/images/networks/arbitrum-chain.svg`);
const polygonIcon = useImage(`assets/images/networks/polygon.svg`);
const optimismIcon = useImage(`assets/images/networks/optimism.svg`);
const moonriver = useImage(`assets/images/networks/moonriver.svg`);
const kava = useImage(`assets/images/networks/kava.png`);

export type ChainConfig = {
  name: string;
  icon: string;
  chainId: number;
  lzChainId: number;
};

const config: Array<ChainConfig> = [
  {
    name: "Ethereum",
    icon: ethIcon,
    chainId: 1,
    lzChainId: 101,
  },
  {
    name: "BSC",
    icon: binanceIcon,
    chainId: 56,
    lzChainId: 102,
  },
  {
    name: "Arbitrum",
    icon: arbitrumIcon,
    chainId: 42161,
    lzChainId: 110,
  },
  {
    name: "Polygon",
    icon: polygonIcon,
    chainId: 137,
    lzChainId: 109,
  },
  {
    name: "Optimism",
    icon: optimismIcon,
    chainId: 10,
    lzChainId: 111,
  },
  {
    name: "Avalanche",
    icon: avalancheIcon,
    chainId: 43114,
    lzChainId: 106,
  },
  {
    name: "Fantom",
    icon: fantomIcon,
    chainId: 250,
    lzChainId: 112,
  },
  {
    name: "Moonriver",
    icon: moonriver,
    chainId: 1285,
    lzChainId: 167,
  },
  {
    name: "Kava EVM",
    icon: kava,
    chainId: 2222,
    lzChainId: 177,
  },
];

export default config;
