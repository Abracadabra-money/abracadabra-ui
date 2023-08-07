import ethIcon from "@/assets/images/networks/ethereum-icon.svg";
import fantomIcon from "@/assets/images/networks/fantom-icon.svg";
import polygonIcon from "@/assets/images/networks/polygon-icon.svg";
import binanceIcon from "@/assets/images/networks/binance-icon.svg";
import avalancheIcon from "@/assets/images/networks/avalanche-icon.png";
import arbitrumIcon from "@/assets/images/networks/arbitrum-icon.svg";
import optimismIcon from "@/assets/images/networks/optimism-icon.svg";
import moonriver from "@/assets/images/networks/moonriver.svg";
import kava from "@/assets/images/networks/kava.png";
import base from "@/assets/images/networks/base.png";

export default {
  state: {
    networks: [
      {
        chainId: 1,
        name: "ETH",
        rpc: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        icon: ethIcon,
        switchData: {
          chainId: "0x01",
        },
      },
      {
        chainId: 42161,
        name: "AETH",
        rpc: "https://arb1.arbitrum.io/rpc",
        icon: arbitrumIcon,
        switchData: {
          chainId: "0xa4b1",
          chainName: "Arbitrum One",

          rpcUrls: ["https://arb1.arbitrum.io/rpc"],

          blockExplorerUrls: ["https://arbiscan.io"],
        },
      },
      {
        chainId: 43114,
        name: "AVAX",
        rpc: "https://api.avax.network/ext/bc/C/rpc",
        icon: avalancheIcon,
        switchData: {
          chainId: "0xa86a",
          chainName: "Avalanche Mainnet",

          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],

          blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
        },
      },
      {
        chainId: 250,
        name: "FTM",
        rpc: "https://rpc.ftm.tools/",
        icon: fantomIcon,
        switchData: {
          chainId: "0xfa",
          chainName: "Fantom Opera Mainnet",

          rpcUrls: [
            "https://rpcapi.fantom.network/",
            "https://rpc.fantom.network/",
          ],

          iconUrls: ["https://ftmscan.com/images/logo-ftmscan.svg?v=0.0.2"],

          blockExplorerUrls: ["https://ftmscan.com/"],

          nativeCurrency: {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18,
          },
        },
      },
      {
        chainId: 56,
        name: "BSC",
        rpc: "https://bsc-dataseed.binance.org/",
        icon: binanceIcon,
        switchData: {
          chainId: "0x38",
          chainName: "Binance Smart Chain",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: [
            "https://bsc-dataseed.binance.org/",
            "https://bsc-dataseed1.defibit.io/",
            "https://bsc-dataseed1.ninicoin.io/",
          ],
          blockExplorerUrls: ["https://bscscan.com"],
          iconUrls: [
            "https://s2.coinmarketcap.com/static/img/coins/200x200/1839.png",
          ],
        },
      },
      {
        chainId: 137,
        name: "MATIC",
        rpc: null,
        icon: polygonIcon,
        switchData: {
          chainId: "0x89",
          chainName: "Polygon Mainnet",

          rpcUrls: ["https://polygon-rpc.com/"],

          iconUrls: ["https://polygonscan.com/images/svg/brands/polygon.svg"],

          blockExplorerUrls: ["https://polygonscan.com/"],

          nativeCurrency: {
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
          },
        },
      },
      {
        chainId: 10,
        name: "OP",
        rpc: null,
        icon: optimismIcon,
        switchData: {
          chainId: "0xa",
          chainName: "Optimism (mainnet)",
          rpcUrls: ["https://mainnet.optimism.io"],
          blockExplorerUrls: ["https://optimistic.etherscan.io"],
        },
      },
      {
        chainId: 1285,
        name: "Moonriver",
        rpc: "https://rpc.api.moonriver.moonbeam.network",
        icon: moonriver,
        switchData: {
          chainId: "0x505",
          chainName: "Moonriver",
          rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
          blockExplorerUrls: ["https://moonriver.moonscan.io/"],
        },
      },
      {
        chainId: 2222,
        name: "Kava EVM",
        rpc: "https://arb1.arbitrum.io/rpc",
        icon: kava,
        switchData: {
          chainId: "0x8ae",
          chainName: "Kava EVM",

          rpcUrls: ["https://evm.kava.io"],

          blockExplorerUrls: ["https://explorer.kava.io"],
        },
      },
      {
        chainId: 8453,
        name: "Base",
        rpc: "https://mainnet.base.org",
        icon: base,
      },
    ],
  },
  getters: {
    getAvailableNetworks: (state) => state.networks,
    getChainIcon: (state) => (chainId) => {
      const network = state.networks.find(
        (network) => network.chainId === +chainId
      );
      return network.icon;
    },
  },
};
