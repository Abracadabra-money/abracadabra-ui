export default {
  state: {
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isMetamaskActive: false,
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
    setChainId(state, payload) {
      state.chainId = payload;
    },
    setWalletConnection(state, payload) {
      state.isWalletConnected = payload;
    },
    setMetamaskActive(state, payload) {
      state.isMetamaskActive = payload;
    },

    SET_WALLET_CHECK_IN_PROCCESS(state, payload) {
      state.walletCheckInProcess = payload;
    },
  },
  getters: {
    getProvider: (state) => state.provider,
    getSigner: (state) => state.signer,
    getAccount: (state) => state.account,
    getChainId: (state) => state.chainId,
    getWalletIsConnected: (state) => state.isWalletConnected,
    getWalletCheckInProccess: (state) => state.walletCheckInProcess,
    getMetamaskActive: (state) => state.isMetamaskActive,
  },
};
