import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({ networks: "getAvailableNetworks" }),
  },
  methods: {
    async switchNetwork(chainId) {
      const provider = this.$store.getters.getProvider;
      const isCoinbase = this.$store.getters.getIsCoinbase;
      const data = this.networks.find(
        ({ switchData }) => switchData.chainId === chainId
      )?.switchData;
      try {
        await provider.provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: chainId === "0x01" ? "0x1" : chainId,
            },
          ],
        });

        if (isCoinbase) {
          window.location.reload();
        }
      } catch (error) {
        console.log("switch network err:", error);

        // if(error.code === -32602) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [data],
          });

          if (isCoinbase) {
            window.location.reload();
          }
        } catch (e) {
          console.log("wallet_addEthereumChain err:", e);
        }

        // }
      }
    },
    switchNetworkWithoutConnect(chainId) {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId);
      window.location.reload();
    },
  },
};
