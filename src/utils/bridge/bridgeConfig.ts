import abi from "@/utils/abi/bridge/index";
import { useImage } from "@/helpers/useImage";

const ethIcon = useImage(`assets/images/networks/ethereum.svg`);
const binanceIcon = useImage(`assets/images/networks/binance.svg`);
const fantomIcon = useImage(`assets/images/networks/fantom.svg`);
const avalancheIcon = useImage(`assets/images/networks/avalanche.svg`);
const arbitrumIcon = useImage(`assets/images/networks/arbitrum-chain.svg`);
const polygonIcon = useImage(`assets/images/networks/polygon.svg`);
const optimismIcon = useImage(`assets/images/networks/optimism.svg`);
const moonriver = useImage(`assets/images/networks/moonriver.svg`);

export type BridgeConfig = {
  chainId: number;
  chainName: string;
  chainIcon: string;
  destinationMax: number;
  contract: {
    address: string;
    abi: any;
  };
  defaultValue: any;
};

const config: Array<BridgeConfig> = [
  {
    chainId: 1,
    chainName: "Ethereum",
    chainIcon: ethIcon,
    destinationMax: 0.24,
    contract: {
      address: "0xC1235796B310106F46c2352E0c93fDE50FbacdB6",
      abi: abi.LzProxyOFTV2,
    },
    defaultValue: {
      10: "0.000000587209028",
      56: "0",
      137: "0.12769615656648925",
      250: "0.028548233315008973",
      1285: "0",
      42161: "0.000197125401096902",
      43114: "0.007909505245705214",
    },
  },
  {
    chainId: 10,
    chainName: "OP",
    chainIcon: optimismIcon,
    destinationMax: 0.24,
    contract: {
      address: "0xA3Ba2164553D2f266863968641a9cA47525Cb11D",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.119489304809683491",
      56: "0",
      137: "0.12769615656648925",
      250: "0.026834613604608669",
      1285: "0",
      42161: "0.000278362471171267",
      43114: "0.006601526510375709",
    },
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    destinationMax: 1.32,
    contract: {
      address: "0xaB137bb12e93fEdB8B639771c4C4fE29aC138Ee6",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.105235446281148448",
      10: "0.0000009426358548",
      137: "0.12769615656648925",
      250: "0.030083711161502848",
      1285: "0",
      42161: "0.000918881105354775",
      43114: "0.006451582412018373",
    },
  },
  {
    chainId: 137,
    chainName: "MATIC",
    chainIcon: polygonIcon,
    destinationMax: 681,
    contract: {
      address: "0xF4B36812d1645dca9d562846E3aBf416D590349e",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.009214665824547975",
      10: "0.00000296156132",
      56: "0",
      250: "0.035091746032134288",
      1285: "0",
      42161: "0.000514784975414775",
      43114: "0.006653377736217831",
    },
  },
  {
    chainId: 250,
    chainName: "FTM",
    chainIcon: fantomIcon,
    destinationMax: 631,
    contract: {
      address: "0xd3a238d0E0f47AaC26defd2AFCf03eA41DA263C7",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.009609676187498731",
      10: "0.00000291885122",
      56: "0",
      137: "0.12769615656648925",
      1285: "0",
      42161: "0.000471314396755295",
      43114: "0.007084992346795497",
    },
  },
  {
    chainId: 1285,
    chainName: "Moonriver",
    chainIcon: moonriver,
    destinationMax: 8,
    contract: {
      address: "0x15f57fbCB7A443aC6022e051a46cAE19491bC298",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0",
      10: "0",
      56: "0",
      137: "0",
      250: "0",
      42161: "0",
      43114: "0",
    },
  },
  {
    chainId: 42161,
    chainName: "AETH",
    chainIcon: arbitrumIcon,
    destinationMax: 0.24,
    contract: {
      address: "0xB94d2014735B96152ddf97825a816Fca26846e91",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.008858578698816767",
      10: "0.00000285787311",
      56: "0.0032258135959937",
      137: "0.12769615656648925",
      250: "0.04645576777626232",
      1285: "0",
      43114: "0.007487999650150403",
    },
  },
  {
    chainId: 43114,
    chainName: "AVAX",
    chainIcon: avalancheIcon,
    destinationMax: 18.47,
    contract: {
      address: "0x56d924066bf9eF61caA26F8f1aeB451EA950e475",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.006523560791554295",
      10: "0.000002913707586",
      56: "0",
      137: "0.12769615656648925",
      250: "0.055201363318514121",
      1285: "0",
      42161: "0.000276367799372566",
    },
  },
];

export default config;
