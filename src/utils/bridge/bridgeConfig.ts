import abi from "@/utils/abi/bridge/index";
import { useImage } from "@/helpers/useImage";

const ethIcon = useImage(`assets/images/bridge/ETH.png`);
const fantomIcon = useImage(`assets/images/bridge/FTM.png`);
const polygonIcon = useImage(`assets/images/bridge/MATIC.png`);
const binanceIcon = useImage(`assets/images/bridge/BNB.png`);
const avalancheIcon = useImage(`assets/images/bridge/AVAX.png`);
const arbitrumIcon = useImage(`assets/images/bridge/Arbitrum.png`);
const optimismIcon = useImage(`assets/images/networks/optimism-icon.svg`);
const moonriver = useImage(`assets/images/networks/moonriver.svg`);

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
      address: "0xC1235796B310106F46c2352E0c93fDE50FbacdB6",
      abi: abi.LzProxyOFTV2,
    },
  },
  {
    chainId: 10,
    chainName: "OP",
    chainIcon: optimismIcon,
    contract: {
      address: "0xA3Ba2164553D2f266863968641a9cA47525Cb11D",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    contract: {
      address: "0xaB137bb12e93fEdB8B639771c4C4fE29aC138Ee6",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 137,
    chainName: "MATIC",
    chainIcon: polygonIcon,
    contract: {
      address: "0xF4B36812d1645dca9d562846E3aBf416D590349e",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 250,
    chainName: "FTM",
    chainIcon: fantomIcon,
    contract: {
      address: "0xd3a238d0E0f47AaC26defd2AFCf03eA41DA263C7",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 1285,
    chainName: "Moonriver",
    chainIcon: moonriver,
    contract: {
      address: "0x15f57fbCB7A443aC6022e051a46cAE19491bC298",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 42161,
    chainName: "AETH",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0xB94d2014735B96152ddf97825a816Fca26846e91",
      abi: abi.LzIndirectOFTV2,
    },
  },
  {
    chainId: 43114,
    chainName: "AVAX",
    chainIcon: avalancheIcon,
    contract: {
      address: "0x56d924066bf9eF61caA26F8f1aeB451EA950e475",
      abi: abi.LzIndirectOFTV2,
    },
  },
];

export default config;
