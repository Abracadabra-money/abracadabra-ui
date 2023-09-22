import store from "@/store";
import { markRaw } from "vue";
import { ethers } from "ethers";
import {
  configureChains,
  createConfig,
  watchAccount,
  watchNetwork,
} from "@wagmi/core";

import { publicProvider } from "@wagmi/core/providers/public";

import { mainnet } from "./chains/mainnet";
import { kava } from "./chains/kava";
import { base } from "./chains/base";
import { linea } from "./chains/linea";

import {
  optimism,
  bsc,
  polygon,
  fantom,
  moonriver,
  arbitrum,
  avalanche,
} from "@wagmi/core/chains";

import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { sanctionAbi } from "@/utils/abi/sanctionAbi";

import { walletConnectProvider } from "@web3modal/wagmi";
import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/vue";

import { getEthersSigner } from "./getEthersSigner";

import { useImage } from "@/helpers/useImage";

const rpc = {
  1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  10: "https://mainnet.optimism.io",
  56: "https://bsc-dataseed.binance.org/",
  137: "https://polygon-rpc.com",
  250: "https://rpc.ftm.tools/",
  1285: "https://rpc.api.moonriver.moonbeam.network",
  8453: "https://mainnet.base.org",
  42161: "https://arb1.arbitrum.io/rpc",
  43114: "https://api.avax.network/ext/bc/C/rpc",
  2222: "https://evm.kava.io ",
  59144: "https://rpc.linea.build",
};

// 1. Define constants
const projectId = import.meta.env.VITE_APP_CONNECT_KEY;
if (!projectId) throw new Error("You need to provide projectId env");

const chains = [
  mainnet,
  bsc,
  polygon,
  avalanche,
  fantom,
  arbitrum,
  optimism,
  moonriver,
  kava,
  base,
  linea,
];

// 2. Configure wagmi client
const { publicClient } = configureChains(chains, [
  publicProvider(),
  walletConnectProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ chains, version: 1, projectId }),
  publicClient,
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiConfig, chains);

createWeb3Modal(
  {
    wagmiConfig,
    projectId,
    themeMode: "dark",
    themeVariables: {
      "--w3m-font-family": "'Prompt', sans-serif",
      "--w3m-background-color": "rgba(60, 60, 60, 0.8)",
      "--w3m-accent-color": "#76c3f5",
      "--w3m-z-index": "1000",
    },
    chainImages: {
      2222: useImage("assets/images/networks/kava.png"),
      8453: useImage("assets/images/networks/base.png"),
      59144: useImage("assets/images/networks/linea.png"),
    },
    chains,
  },
  ethereumClient
);
const web3modal = useWeb3Modal();

const checkSanctionAddress = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );

  const contract = new ethers.Contract(
    "0x40c57923924b5c5c5455c48d93317139addac8fb",
    JSON.stringify(sanctionAbi),
    provider
  );

  const response = await contract.isSanctioned(address);

  if (response) {
    await store.dispatch("notifications/new", {
      title: "Sanction address Warning",
      msg: "It looks like the address you have connected to Abracadabra UI is on a Sanction List. Abracadabra Money is not offering services to sanctioned addresses.",
      type: "error",
    });

    return true;
  }
  return false;
};

const initWithoutConnect = async () => {
  const chainId = +(localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || 1);

  const unsupportedChain = !rpc[chainId];
  const currentRpc = unsupportedChain ? rpc[1] : rpc[chainId];
  const currentChain = unsupportedChain ? 1 : chainId;

  const provider = markRaw(
    new ethers.providers.StaticJsonRpcProvider(currentRpc)
  );

  const account = ethereumClient.getAccount().address;
  watchAccount(({ address }) => {
    if (account !== address) window.location.reload();
  });

  store.commit("setChainId", currentChain);
  store.commit("setProvider", provider);
  store.commit("setAccount", null);

  store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
  store.commit("setWalletConnection", true);
};

const onConnectNew = async () => {
  try {
    const account = ethereumClient.getAccount().address;
    const activeChain = ethereumClient.getNetwork().chain;
    const chainId = activeChain.id;
    const unsupportedChain = !rpc[chainId];
    const currentRpc = unsupportedChain ? rpc[1] : rpc[chainId];

    if (!unsupportedChain) {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId);
    }

    if (await checkSanctionAddress(account)) return false;

    watchAccount(({ address }) => {
      if (account !== address) window.location.reload();
    });

    watchNetwork((network) => {
      if (chainId !== network.chain.id) window.location.reload();
    });

    const provider = markRaw(
      new ethers.providers.StaticJsonRpcProvider(currentRpc)
    );

    const signer = unsupportedChain
      ? provider
      : await getEthersSigner({ chainId });

    store.commit("setChainId", chainId);
    store.commit("setProvider", provider);
    store.commit("setSigner", markRaw(signer)); // WARN
    store.commit("setAccount", account);
    store.dispatch("checkENSName", account);
    store.commit("setWalletConnection", true);
  } catch (error) {
    console.log("Connection error: ", error);
  }
};

const subscribeProvider = async () => {
  await watchAccount(({ isConnected }) => {
    console.log("herter isConnected", isConnected);
    isConnected ? onConnectNew() : window.location.reload();
  });
};

if (ethereumClient.getAccount().isConnected) {
  onConnectNew();
} else initWithoutConnect();

store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);

export default {
  async install(Vue) {
    Vue.config.globalProperties.$connectWallet = async () => {
      await subscribeProvider();
    };

    Vue.config.globalProperties.$openWeb3modal = async () => {
      await web3modal.open();
    };

    Vue.config.globalProperties.$openNetworkModal = async () => {
      await web3modal.open({ view: "Networks" });
    };

    Vue.config.globalProperties.$closeWeb3modal = async () => {
      await web3modal.close();
    };
  },
};
