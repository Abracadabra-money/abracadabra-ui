import abi from "@/utils/abi/bridge/index";
import { useImage } from "@/helpers/useImage";

const ethIcon = useImage(`assets/images/bridge/ETH.png`);
const fantomIcon = useImage(`assets/images/bridge/FTM.png`);
const polygonIcon = useImage(`assets/images/bridge/MATIC.png`);
const binanceIcon = useImage(`assets/images/bridge/BNB.png`);
const avalancheIcon = useImage(`assets/images/bridge/AVAX.png`);
const arbitrumIcon = useImage(`assets/images/bridge/Arbitrum.png`);
const optimismIcon = useImage(`assets/images/networks/optimism-icon.svg`);

export type BridgeConfig = {
  chainId: number;
  chainName: string;
  chainIcon: string;
  contract: {
    address: string;
    abi: any;
  };
};

const config: Array<BridgeConfig> = [
  {
    chainId: 1,
    chainName: "ETH",
    chainIcon: ethIcon,
    contract: {
      address: "0x8D0aC6c1d28Ef9a14E8C3ecfCF558a84540A84E4",
      abi: abi.LzProxyOFTV2,
    },
  },
  {
    chainId: 10,
    chainName: "OP",
    chainIcon: optimismIcon,
    contract: {
      address: "0xA9Ba9852a249Aa9c596C990Cc409cFeAf653fAC0",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    contract: {
      address: "0x854A86d09ce114e07aC3E63946bE91B6B1CF10A3",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 137,
    chainName: "MATIC",
    chainIcon: polygonIcon,
    contract: {
      address: "0x1cA9F1A7cf93284Fff9eC9A7EB627f9dE04A0EA8",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 250,
    chainName: "FTM",
    chainIcon: fantomIcon,
    contract: {
      address: "0x6E4358c889bb7871061904Be31Fe47C3B8b7F442",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 1285,
    chainName: "Moonriver",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0x43838338F30795185Dabf1e52DaE6a3FEEdC953d",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 42161,
    chainName: "AETH",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0x9D16087301225a377392942De4BB5b23E35A894b",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 43114,
    chainName: "AVAX",
    chainIcon: avalancheIcon,
    contract: {
      address: "0x0C11084F9Bb72E4305088d329a5A1a64a6dF2A3c",
      abi: abi.LzIndirectOFTV2,
    },
  },
];

export default config;
