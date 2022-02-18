import { ethers } from "ethers";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";

import store from "../../store";

// WALLETCONNECT
const walletconnect = {
  package: WalletConnectProvider,
  options: {
    rpc: {
      1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      56: "https://bsc-dataseed.binance.org/",
      250: "https://rpc.ftm.tools/",
      42161: "https://arb1.arbitrum.io/rpc",
      43114: "https://api.avax.network/ext/bc/C/rpc",
    },
  },
};

const providerOptions = {
  walletconnect,
};

const web3Modal = new Web3Modal({
  providerOptions,
  cacheProvider: true,
  disableInjectedProvider: false,
  network: "mainnet",
});

/**
 * Check chached provider and try to connect.
 * If provider exist => store into vuex
 */
setTimeout(async () => {
  const { cachedProvider } = web3Modal.providerController;

  if (cachedProvider) {
    console.log("has cachedProvider", cachedProvider);
    console.log("has cachedProvider", web3Modal.providerController);
    try {
      let connectedProvider = await web3Modal.connectTo(cachedProvider);

      connectedProvider = connectedProvider.selectedProvider
        ? connectedProvider.selectedProvider
        : connectedProvider;

      if (!connectedProvider) {
        store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
        return;
      }

      if (connectedProvider) {
        console.log("connectedProvider", connectedProvider);
        let address = "";

        if (connectedProvider.isMetaMask) {
          console.log("cachedProvider METAMASK");
          store.commit("setMetamaskActive", true);
          address = connectedProvider.selectedAddress;
        }

        if (connectedProvider.accounts) {
          address = connectedProvider.accounts[0];
        }

        if (connectedProvider._addresses) {
          address = connectedProvider._addresses[0];
        }

        const provider = new ethers.providers.Web3Provider(connectedProvider);
        const signer = provider.getSigner(address);

        connectedProvider.on("chainChanged", () => {
          window.location.reload();
        });

        connectedProvider.on("accountsChanged", () => {
          window.location.reload();
        });

        connectedProvider.on("disconnect", () => {
          localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
          localStorage.removeItem(
            "-walletlink:https://www.walletlink.org:session:linked"
          );
          localStorage.removeItem(
            "-walletlink:https://www.walletlink.org:IsStandaloneSigning"
          );
          localStorage.removeItem(
            "-walletlink:https://www.walletlink.org:session:secret"
          );
          web3Modal.clearCachedProvider();
          web3Modal.providerController.cachedProvider = null;
          store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
          window.location.reload();
        });

        const { chainId } = await provider.getNetwork();

        console.log("chainID", chainId);

        store.commit("setChainId", chainId);
        store.commit("setProvider", provider);
        console.log(33333)
        store.commit("setSigner", signer);
        store.commit("setAccount", address);
        store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
        store.commit("setWalletConnection", true);
      }
    } catch (e) {
      console.log("ERROR:", e);
      localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:session:linked"
      );
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:IsStandaloneSigning"
      );
      localStorage.removeItem(
        "-walletlink:https://www.walletlink.org:session:secret"
      );
      web3Modal.clearCachedProvider();
      web3Modal.providerController.cachedProvider = null;
      store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
      return;
    }
  } else if (window.ethereum?.isMetaMask) {
    console.log("METAMASK");
    store.commit("setMetamaskActive", true);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    store.commit("setChainId", chainId);
    store.commit("setProvider", provider);
    store.commit("setSigner", null);
    store.commit("setAccount", null);
    store.commit("setWalletConnection", true);

    if (accounts.length !== 0) {
      const signer = provider.getSigner(accounts[0]);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("disconnect", () => {
        localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
        web3Modal.clearCachedProvider();
        window.location.reload();
      });

      store.commit("setProvider", provider);
      store.commit("setSigner", signer);
      store.commit("setAccount", accounts[0]);
      store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
      store.commit("setWalletConnection", true);
    }
  }

  store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
}, 500);

export default {
  async install(Vue) {
    Vue.prototype.$connectWallet = async () => {
      try {
        let address = "";
        let provider = await web3Modal.connect();

        provider = provider.selectedProvider
          ? provider.selectedProvider
          : provider;

        console.log("provider", provider);

        if (!provider) {
          return;
        }

        provider.enable();

        if (provider.isMetaMask) {
          console.log("CONNECT METAMASK");
          store.commit("setMetamaskActive", true);
          address = provider.selectedAddress;
        }

        if (provider.accounts) {
          address = provider.accounts[0];
        }

        if (provider._addresses) {
          address = provider._addresses[0];
        }

        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            address = accounts[0];
          } catch (e) {
            console.log(e);
          }
        }

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner(address);

        provider.on("chainChanged", () => {
          window.location.reload();
        });

        provider.on("accountsChanged", () => {
          window.location.reload();
        });

        provider.on("disconnect", () => {
          localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
          localStorage.removeItem(
            "-walletlink:https://www.walletlink.org:session:linked"
          );
          localStorage.removeItem(
            "-walletlink:https://www.walletlink.org:IsStandaloneSigning"
          );
          localStorage.removeItem(
            "-walletlink:https://www.walletlink.org:session:secret"
          );
          web3Modal.clearCachedProvider();
          web3Modal.providerController.cachedProvider = null;
          store.commit("SET_WALLET_CHECK_IN_PROCCESS", false);
          window.location.reload();
        });

        let { chainId } = await ethersProvider.getNetwork();

        if (!chainId) {
          try {
            chainId = window.ethereum?.chainId;
            console.log("HERE");
          } catch (e) {
            console.log(e);
          }
        }

        store.commit("setChainId", chainId);
        store.commit("setProvider", ethersProvider);
        store.commit("setSigner", signer);
        store.commit("setAccount", address);
        store.commit("setWalletConnection", true);
      } catch (error) {
        console.log("Error in connect modal");
        console.log(error);
      }
    };
  },
};
