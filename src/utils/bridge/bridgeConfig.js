import contracts from "@/utils/abi/bridge/index";

import ethIcon from "@/assets/images/bridge/ETH.png";
import fantomIcon from "@/assets/images/bridge/FTM.png";
import polygonIcon from "@/assets/images/bridge/MATIC.png";
import binanceIcon from "@/assets/images/bridge/BNB.png";
import avalancheIcon from "@/assets/images/bridge/AVAX.png";
import arbitrumIcon from "@/assets/images/bridge/Arbitrum.png";
import optimismIcon from "@/assets/images/networks/optimism-icon.svg";

export default [
  {
    chainId: 1,
    chainName: "ETH",
    chainIcon: ethIcon,
    contract: {
      address: "0x195dDA36B484D31581c99bcF3f1c3ce581F5BEce",
      abi: contracts.ProxyOFTV2,
    },
  },
  {
    chainId: 10,
    chainName: "OP",
    chainIcon: optimismIcon,
    contract: {
      address: "0xAc9c9b9C354DE58ca34420F79BbAB67DEfd8324f",
      abi: contracts.ProxyOFTV2,
    },
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    contract: {
      address: "0xf76DA2D3656E1cC5Ca2Fbb9663C89f7d8AAe20Fc",
      abi: contracts.ProxyOFTV2,
    },
  },
  {
    chainId: 137,
    chainName: "MATIC",
    chainIcon: polygonIcon,
    contract: {
      address: "0x563111A691302D9700Abc617E99236D6a6FC537b",
      abi: contracts.AnyswapV4Router,
    },
  },
  {
    chainId: 250,
    chainName: "FTM",
    chainIcon: fantomIcon,
    contract: {
      address: "0x6D1EAAdeD97DC9d49BCb08Bdcd15EAcb08da42e4",
      abi: contracts.AnyswapV4Router,
    },
  },
  {
    chainId: 1285,
    chainName: "Moonriver",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0xa93C81f564579381116ee3E007C9fCFd2EBa1723",
      abi: contracts.AnyswapV4Router,
    },
  },
  {
    chainId: 42161,
    chainName: "AETH",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0x3b47E8EF1fC0F7fafdd0F428E727A9918E94FbE9",
      abi: contracts.AnyswapV4Router,
    },
  },
  {
    chainId: 43114,
    chainName: "AVAX",
    chainIcon: avalancheIcon,
    contract: {
      address: "0x225C5E03Fc234A9A71c12DC0559d8FD4e460f96f",
      abi: contracts.AnyswapV4Router,
    },
  },
];
