import ethIcon from "@/assets/images/bridge/ETH.png";
import fantomIcon from "@/assets/images/bridge/FTM.png";
import polygonIcon from "@/assets/images/bridge/MATIC.png";
import binanceIcon from "@/assets/images/bridge/BNB.png";
import avalancheIcon from "@/assets/images/bridge/AVAX.png";
import arbitrumIcon from "@/assets/images/bridge/Arbitrum.png";
import optimismIcon from "@/assets/images/networks/optimism-icon.svg";

export default [
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
