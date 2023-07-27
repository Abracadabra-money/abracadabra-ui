import abi from "@/utils/abi/beam/";
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

export type BeamConfig = {
  chainId: number;
  chainName: string;
  chainIcon: string;
  contract: {
    address: string;
    abi: any;
  };
  defaultValue: any;
};

const config: Array<BeamConfig> = [
  {
    chainId: 1,
    chainName: "Ethereum",
    chainIcon: ethIcon,
    contract: {
      address: "0x439a5f0f5E8d149DDA9a0Ca367D4a8e4D6f83C10",
      abi: abi.LzProxyOFTV2,
    },
    defaultValue: {
      10: "0.000000587209028",
      56: "0.000548",
      137: "0.12769615656648925",
      250: "0.028548233315008973",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000197125401096902",
      43114: "0.007909505245705214",
    },
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    contract: {
      address: "0x41D5A04B4e03dC27dC1f5C5A576Ad2187bc601Af",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.105235446281148448",
      10: "0.0000009426358548",
      137: "0.12769615656648925",
      250: "0.030083711161502848",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000918881105354775",
      43114: "0.006451582412018373",
    },
  },
  {
    chainId: 42161,
    chainName: "Arbitrum",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0x4A351d97E60EF961a0a660B02998de841F9859c1",
      abi: abi.OFTWrapper,
    },
    defaultValue: {
      1: "0.008858578698816767",
      10: "0.00000285787311",
      56: "0.0032258135959937",
      137: "0.12769615656648925",
      250: "0.04645576777626232",
      1285: "0.01774",
      2222: "0.32",
      43114: "0.007487999650150403",
    },
  },
  {
    chainId: 137,
    chainName: "Polygon",
    chainIcon: polygonIcon,
    contract: {
      address: "0xca0d86afc25c57a6d2aCdf331CaBd4C9CEE05533",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.009214665824547975",
      10: "0.00000296156132",
      56: "0.000548",
      250: "0.035091746032134288",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000514784975414775",
      43114: "0.006653377736217831",
    },
  },
  {
    chainId: 10,
    chainName: "Optimism",
    chainIcon: optimismIcon,
    contract: {
      address: "0x48686c24697fe9042531B64D792304e514E74339",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.119489304809683491",
      56: "0.000548",
      137: "0.12769615656648925",
      250: "0.026834613604608669",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000278362471171267",
      43114: "0.006601526510375709",
    },
  },
  {
    chainId: 43114,
    chainName: "Avalanche",
    chainIcon: avalancheIcon,
    contract: {
      address: "0xb3a66127ccb143bfb01d3aecd3ce9d17381b130d",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.006523560791554295",
      10: "0.000002913707586",
      56: "0.000548",
      137: "0.12769615656648925",
      250: "0.055201363318514121",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000276367799372566",
    },
  },
  {
    chainId: 250,
    chainName: "Fantom",
    chainIcon: fantomIcon,
    contract: {
      address: "0xc5c01568a3B5d8c203964049615401Aaf0783191",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.009609676187498731",
      10: "0.00000291885122",
      56: "0.000548",
      137: "0.12769615656648925",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000471314396755295",
      43114: "0.007084992346795497",
    },
  },
  {
    chainId: 1285,
    chainName: "Moonriver",
    chainIcon: moonriver,
    contract: {
      address: "0xeF2dBDfeC54c466F7Ff92C9c5c75aBB6794f0195",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.009609676187498731",
      10: "0.00000291885122",
      56: "0.000548",
      137: "0.12769615656648925",
      2222: "0.32",
      250: "0.055201363318514121",
      42161: "0.000278362471171267",
      43114: "0.006601526510375709",
    },
  },
  {
    chainId: 2222,
    chainName: "Kava EVM",
    chainIcon: kava,
    contract: {
      address: "0xc7a161Cfd0e133d289B13692b636B8e8B5CD8d8c",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.009609676187498731",
      10: "0.00000291885122",
      56: "0.000548",
      137: "0.12769615656648925",
      1285: "0.01774",
      250: "0.055201363318514121",
      42161: "0.000278362471171267",
      43114: "0.006601526510375709",
    },
  },
];

export default config;
