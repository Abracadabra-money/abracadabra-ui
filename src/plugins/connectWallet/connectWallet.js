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

import {
  // mainnet,
  optimism,
  bsc,
  polygon,
  fantom,
  moonriver,
  arbitrum,
  avalanche,
} from "@wagmi/core/chains";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { sanctionAbi } from "@/utils/abi/sanctionAbi";

import { getEthersProvider } from "./getEthersProvider";
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
  base
];

// 2. Configure wagmi client
const { publicClient } = configureChains(chains, [
  publicProvider(),
  w3mProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ chains, version: 1, projectId }),
  publicClient,
});

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal(
  {
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
    },
  },
  ethereumClient
);

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
  const provider = markRaw(
    new ethers.providers.StaticJsonRpcProvider(rpc[chainId])
  );

  const account = ethereumClient.getAccount().address;
  watchAccount(({ address }) => {
    if (account !== address) window.location.reload();
  });

  store.commit("setChainId", chainId);
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
    localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId);

    if (await checkSanctionAddress(account)) return false;

    watchAccount(({ address }) => {
      if (account !== address) window.location.reload();
    });

    watchNetwork((network) => {
      if (chainId !== network.chain.id) window.location.reload();
    });

    const provider = markRaw(
      new ethers.providers.StaticJsonRpcProvider(rpc[chainId])
    );
    const signer = markRaw(await getEthersSigner({ chainId }));

    store.commit("setChainId", chainId);
    store.commit("setProvider", provider);
    store.commit("setSigner", signer); // WARN
    store.commit("setAccount", account);
    store.dispatch("checkENSName", account);
    store.commit("setWalletConnection", true);
  } catch (error) {
    console.log("Connection error: ", error);
  }
};

const subscribeProvider = async (web3modal) => {
  await web3modal.subscribeEvents(({ data }) => {
    console.log("herter", data);
    if (data.name === "ACCOUNT_CONNECTED") onConnectNew();
    if (data.name === "ACCOUNT_DISCONNECTED") window.location.reload();
  });
};

if (ethereumClient.getAccount().isConnected) {
  onConnectNew();
} else initWithoutConnect();

store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);

export default {
  async install(Vue) {
    Vue.config.globalProperties.$connectWallet = async () => {
      await subscribeProvider(web3modal);
    };

    Vue.config.globalProperties.$openWeb3modal = async () => {
      await web3modal.openModal();
    };

    Vue.config.globalProperties.$openNetworkModal = async () => {
      await web3modal.openModal({
        route: "SelectNetwork",
      });
    };

    Vue.config.globalProperties.$closeWeb3modal = async () => {
      web3modal.closeModal();
    };
  },
};
