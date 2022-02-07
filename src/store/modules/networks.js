export default {
  state: {
    networks: [
      {
        chainId: "0x01",
        name: "ETH",
        code: 1,
      },
      {
        chainId: "0x38",
        name: "BSC",
        code: 56,
      },
      {
        chainId: "0xfa",
        name: "FTM",
        code: 250,
      },
      {
        chainId: "0xa86a",
        name: "AVAX",
        code: 43114,
      },
      {
        chainId: "0xa4b1",
        name: "AETH",
        code: 42161,
      },
      {
        chainId: "0x89",
        name: "MATIC",
        code: 137,
      },
    ],
    activeNetwork: "0x01",
  },
  mutations: {
    setActiveNetwork(state, payload) {
      state.activeNetwork = payload;
    },
  },
  getters: {
    getActiveNetwork: (state) => state.activeNetwork,
    getActiveChain: (state) =>
      state.networks.find((item) => item.chainId === state.activeNetwork),
    getAvailableNetworks: (state) => state.networks,
  },
};
