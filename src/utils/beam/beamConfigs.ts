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
const base = useImage(`assets/images/networks/base.png`);

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
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000197125401096902",
    },
  },
  {
    chainId: 56,
    chainName: "BSC",
    chainIcon: binanceIcon,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000918881105354775",
    },
  },
  {
    chainId: 42161,
    chainName: "Arbitrum",
    chainIcon: arbitrumIcon,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
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
      8453: "0.008858578698816767",
    },
  },
  {
    chainId: 137,
    chainName: "Polygon",
    chainIcon: polygonIcon,
    contract: {
      address: "0xE1261E47b08a22Df93af46889EE504C2Aa6DfD4c",
      abi: abi.OFTWrapper,
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
      8453: "0.000514784975414775",
    },
  },
  {
    chainId: 10,
    chainName: "Optimism",
    chainIcon: optimismIcon,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000278362471171267",
    },
  },
  {
    chainId: 43114,
    chainName: "Avalanche",
    chainIcon: avalancheIcon,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000276367799372566",
    },
  },
  {
    chainId: 250,
    chainName: "Fantom",
    chainIcon: fantomIcon,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000471314396755295",
    },
  },
  {
    chainId: 1285,
    chainName: "Moonriver",
    chainIcon: moonriver,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000278362471171267",
    },
  },
  {
    chainId: 2222,
    chainName: "Kava EVM",
    chainIcon: kava,
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
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
      8453: "0.000278362471171267",
    },
  },
  {
    chainId: 8453,
    chainName: "Base",
    chainIcon: base,
    contract: {
      address: "0x4035957323FC05AD9704230E3dc1E7663091d262",
      abi: abi.LzIndirectOFTV2,
    },
    defaultValue: {
      1: "0.008858578698816767",
      10: "0.00000285787311",
      56: "0.0032258135959937",
      137: "0.12769615656648925",
      250: "0.04645576777626232",
      1285: "0.01774",
      2222: "0.32",
      42161: "0.000278362471171267",
      43114: "0.007487999650150403",
    },
  },
];

export default config;
