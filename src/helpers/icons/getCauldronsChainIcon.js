import binanceIcon from "@/assets/images/networks/binance-icon.svg";
import ethereumIcon from "@/assets/images/networks/ethereum-icon.svg";
import optimismIcon from "@/assets/images/networks/optimism-icon.svg";
import polygonIcon from "@/assets/images/networks/polygon-icon.svg";
import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import arbitrumIcon from "@/assets/images/networks/arbitrum-icon.svg";
import avalancheIcon from "@/assets/images/networks/avalanche-icon.png";
const chainIcons = {
  1: ethereumIcon,
  10: optimismIcon,
  56: binanceIcon,
  137: polygonIcon,
  250: fantomIcon,
  42161: arbitrumIcon,
  43114: avalancheIcon,
};
const getCauldronsChainIcon = (chainId) => {
  return chainIcons[chainId];
};

export { getCauldronsChainIcon };
