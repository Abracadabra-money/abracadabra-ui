import { chainsConfigs } from "@/helpers/chains/configs";

export default {
  state: {
    networks: chainsConfigs,
    chainId: null,
  },
  mutations: {
    setChainId(state, payload) {
      state.chainId = payload;
    },
  },
  getters: {
    getAvailableNetworks: (state) => state.networks,
    getChainId: (state) => state.chainId,
    getChainById: (state) => (chainId) => {
      return state.networks.find((chain) => chain.chainId === chainId);
    },
  },
};
