export default {
  state: {
    provider: null,
    signer: null,
    account: null,
    ensName: null,
    isMetamaskActive: false,
    isCoinbase: false,
    isWalletConnected: false,
    isWalletCheckInProcess: true,
    wagmiConfig: null,
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
    setWalletConnection(state, payload) {
      state.isWalletConnected = payload;
    },
    setWagmiConfig(state, payload) {
      state.wagmiConfig = payload;
    },
    setIsCoinbase(state, payload) {
      state.isCoinbase = payload;
    },
    setMetamaskActive(state, payload) {
      state.isMetamaskActive = payload;
    },
    setIsWalletCheckInProcess(state, payload) {
      state.isWalletCheckInProcess = payload;
    },
  },
  getters: {
    getProvider: (state) => state.provider,
    getWagmiConfig: (state) => state.wagmiConfig,
    getSigner: (state) => state.signer,
    getAccount: (state) => state.account,
    getEnsName: (state) => state.ensName,
    getWalletIsConnected: (state) => state.isWalletConnected,
    getIsWalletCheckInProcess: (state) => state.isWalletCheckInProcess,
    getMetamaskActive: (state) => state.isMetamaskActive,
  },
};
