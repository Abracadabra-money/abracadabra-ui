import abi from "@/abis/beam/";

export type BeamConfig = {
  chainId: number;
  chainName: string;
  contract: {
    address: string;
    abi: any;
  };
  settings: {
    contractVersion: number;
    disabledDestinationChains: Array<number>;
    lzChainIdId: number;
  };
  defaultValue: any;
};

const config: Array<BeamConfig> = [
  {
    chainId: 1,
    chainName: "Ethereum",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 101,
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
      81457: "0.000197125401096902",
    },
  },
  {
    chainId: 42161,
    chainName: "Arbitrum",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 110,
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
      59144: "0.008858578698816767",
      81457: "0.000197125401096902",
    },
  },
  {
    chainId: 2222,
    chainName: "KAVA",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [81457],
      lzChainIdId: 177,
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
      59144: "0.000278362471171267",
      81457: "0.000278362471171267",
    },
  },
  {
    chainId: 43114,
    chainName: "Avalanche",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 106,
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
      59144: "0.000276367799372566",
      81457: "0.000276367799372566",
    },
  },
  {
    chainId: 10,
    chainName: "Optimism",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 111,
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
      59144: "0.000278362471171267",
      81457: "0.000278362471171267",
    },
  },
  {
    chainId: 250,
    chainName: "Fantom",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 112,
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
      59144: "0.000471314396755295",
      81457: "0.000471314396755295",
    },
  },
  {
    chainId: 56,
    chainName: "BNB Chain",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 102,
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
      59144: "0.000918881105354775",
      81457: "0.000918881105354775",
    },
  },

  {
    chainId: 137,
    chainName: "Polygon",
    contract: {
      address: "0xE1261E47b08a22Df93af46889EE504C2Aa6DfD4c",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 109,
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
      59144: "0.000514784975414775",
      81457: "0.000514784975414775",
    },
  },

  {
    chainId: 1285,
    chainName: "Moonriver",
    contract: {
      address: "0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC",
      abi: abi.OFTWrapper,
    },
    settings: {
      contractVersion: 2,
      disabledDestinationChains: [],
      lzChainIdId: 167,
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
      59144: "0.000278362471171267",
      81457: "0.000278362471171267",
    },
  },

  {
    chainId: 8453,
    chainName: "BASE",
    contract: {
      address: "0x4035957323FC05AD9704230E3dc1E7663091d262",
      abi: abi.LzIndirectOFTV2,
    },
    settings: {
      contractVersion: 1,
      disabledDestinationChains: [],
      lzChainIdId: 184,
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
      59144: "0.000278362471171267",
      81457: "0.000278362471171267",
    },
  },
  {
    chainId: 59144,
    chainName: "Linea",
    contract: {
      address: "0x60bbeFE16DC584f9AF10138Da1dfbB4CDf25A097",
      abi: abi.LzIndirectOFTV2,
    },
    settings: {
      contractVersion: 1,
      disabledDestinationChains: [],
      lzChainIdId: 183,
    },
    defaultValue: {
      1: "0.008858578698816767",
      10: "0.00000285787311",
      56: "0.0032258135959937",
      137: "0.12769615656648925",
      250: "0.04645576777626232",
      1285: "0.01774",
      2222: "0.32",
      8453: "0.000278362471171267",
      42161: "0.000278362471171267",
      43114: "0.007487999650150403",
      81457: "0.000278362471171267",
    },
  },
  {
    chainId: 81457,
    chainName: "Blast",
    contract: {
      address: "0xcA8A205a579e06Cb1bE137EA3A5E5698C091f018",
      abi: abi.LzIndirectOFTV2,
    },
    settings: {
      contractVersion: 1,
      disabledDestinationChains: [2222],
      lzChainIdId: 243,
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
      59144: "0.008858578698816767",
    },
  },
];

export default config;
