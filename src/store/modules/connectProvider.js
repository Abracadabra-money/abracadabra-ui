import { ethers } from "ethers";
import { MAINNET_RPC_URLS } from "@/constants/chains";

export default {
  state: {
    provider: null,
    signer: null,
    account: null,
    ensName: null,
    chainId: null,
    isMetamaskActive: false,
    isCoinbase: false,
    isWalletConnected: false,
    walletCheckInProcess: true,
  },
  mutations: {
    setProvider(state, payload) {
      state.provider = payload;
    },
    setSigner(state, payload) {
      state.signer = payload;
    },
    setAccount(state, payload) {
      state.account = payload;
    },
    setENSName(state, payload) {
      state.ensName = payload;
    },
    setChainId(state, payload) {
      state.chainId = payload;
    },
    setWalletConnection(state, payload) {
      state.isWalletConnected = payload;
    },
    setIsCoinbase(state, payload) {
      state.isCoinbase = payload;
    },
    setMetamaskActive(state, payload) {
      state.isMetamaskActive = payload;
    },

    SET_WALLET_CHECK_IN_PROCCESS(state, payload) {
      state.walletCheckInProcess = payload;
    },
  },
  actions: {
    async checkENSName({ commit }, address) {
      try {
        const ensName = await new ethers.providers.StaticJsonRpcProvider(
          MAINNET_RPC_URLS
        ).lookupAddress(address);

        if (ensName) commit("setENSName", ensName);
      } catch (error) {
        console.log("fetchENSName ERR:", error);
      }
    },
  },
  getters: {
    getProvider: (state) => state.provider,
    getSigner: (state) => state.signer,
    getAccount: (state) => state.account,
    getEnsName: (state) => state.ensName,
    getChainId: (state) => state.chainId,
    getWalletIsConnected: (state) => state.isWalletConnected,
    getMetamaskActive: (state) => state.isMetamaskActive,
  },
};
