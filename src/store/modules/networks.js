import { chains } from "@/helpers/chains";

export default {
  state: {
    networks: chains,
  },
  getters: {
    getAvailableNetworks: (state) => state.networks,
  },
};
