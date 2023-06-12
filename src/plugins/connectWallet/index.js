import { markRaw } from "vue";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";
import store from "../../store";
import { sanctionAbi } from "@/utils/abi/sanctionAbi";

const walletconnect = {
  package: WalletConnectProvider,
  options: {
    rpc: {
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      10: "https://mainnet.optimism.io",
      56: "https://bsc-dataseed.binance.org/",
      250: "https://rpc.ftm.tools/",
      1285: "https://rpc.api.moonriver.moonbeam.network",
      42161: "https://arb1.arbitrum.io/rpc",
      43114: "https://api.avax.network/ext/bc/C/rpc",
    },
  },
};

const coinbasewallet = {
  package: CoinbaseWalletSDK, // Required
  options: {
    appName: "abracadabra.money", // Required
    rpc: {
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      10: "https://mainnet.optimism.io",
      56: "https://bsc-dataseed.binance.org/",
      250: "https://rpc.ftm.tools/",
      1285: "https://rpc.api.moonriver.moonbeam.network",
      42161: "https://arb1.arbitrum.io/rpc",
      43114: "https://api.avax.network/ext/bc/C/rpc",
    },
  },
};

const binancechainwallet = {
  package: true,
};

const torus = {
  package: Torus,
};

const providerOptions = {
  walletconnect,
  coinbasewallet,
  binancechainwallet,
  torus,
};

const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
  disableInjectedProvider: false,
  theme: "dark",
});

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */

const subscribeProvider = async (provider, isCoinbase) => {
  if (!provider.on) {
    return;
  }

  provider.on("close", () => alert("close"));
  provider.on("accountsChanged", async (account) => {
    if (Array.isArray(account) && !account.length) await resetApp();
    window.location.reload();
  });

  if (!isCoinbase) {
    provider.on("chainChanged", () => window.location.reload());
    provider.on("networkChanged", () => window.location.reload());
  }

  provider.on("disconnect", async () => {
    await resetApp();
  });
};

const initWithoutConnect = async () => {
  const chainId = +(localStorage.getItem("MAGIC_MONEY_CHAIN_ID") || 1);
  const provider = markRaw(
    new ethers.providers.StaticJsonRpcProvider(
      walletconnect.options.rpc[chainId]
    )
  );

  store.commit("setChainId", chainId);
  store.commit("setProvider", provider);
  store.commit("setAccount", null);

  store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
  store.commit("setWalletConnection", true);
};

const checkSanctionAddress = async (address) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );

  const contract = new ethers.Contract(
    "0x40c57923924b5c5c5455c48d93317139addac8fb",
    JSON.stringify(sanctionAbi),
    provider
  );

  const res = await contract.isSanctioned(address);
  if (res) {
    await store.dispatch("notifications/new", {
      title: "Sanction address Warning",
      msg: "It looks like the address you have connected to Abracadabra UI is on a Sanction List. Abracadabra Money is not offering services to sanctioned addresses.",
      type: "error",
    });

    return true;
  }
  return false;
};

const onConnect = async () => {
  try {
    const instance = await web3Modal.connect();

    await instance.enable();

    const isCoinbase = instance.isCoinbaseWallet;
    const isMetaMask = instance.isMetaMask;

    await subscribeProvider(instance, isCoinbase);

    const provider = markRaw(new ethers.providers.Web3Provider(instance));
    const signer = provider.getSigner();

    const accounts = await signer.getAddress();

    const address = Array.isArray(accounts) ? accounts[0] : accounts;

    if (await checkSanctionAddress(address)) {
      initWithoutConnect();
      return false;
    }

    const chainId = await signer.getChainId();

    store.commit("setChainId", chainId);
    store.commit("setProvider", provider);
    store.commit("setSigner", signer);
    store.commit("setAccount", address);
    store.dispatch("checkENSName", address);
    store.commit("setWalletConnection", true);
    store.commit("setIsCoinbase", isCoinbase);
    store.commit("setMetamaskActive", isMetaMask);
  } catch (error) {
    console.log("Connection error: ", error);
  }
};

const resetApp = async () => {
  await web3Modal.clearCachedProvider();
  window.location.reload();
};

if (web3Modal.cachedProvider) {
  onConnect();
} else initWithoutConnect();

store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);

export default {
  async install(Vue) {
    Vue.config.globalProperties.$connectWallet = async () => {
      await web3Modal.clearCachedProvider();
      await onConnect();
    };

    Vue.config.globalProperties.$disconnectWallet = async () => {
      await resetApp();
    };
  },
};
