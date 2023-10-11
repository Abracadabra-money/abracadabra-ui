import { chains } from "@/helpers/chains";

export default {
  state: {
    networks: chains,
  },
  getters: {
    getAvailableNetworks: (state) => state.networks,
    getChainById: (state) => (chainId) => {
      return state.networks.find((chain) => chain.chainId === chainId);
    },
  },
};
