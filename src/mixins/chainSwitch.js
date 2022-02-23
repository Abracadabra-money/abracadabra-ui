import { ethers } from "ethers";
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
      let targetChainId = ethers.utils.hexlify(chainId);

      if (targetChainId === "0x01") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: "0x1",
              },
            ],
          });

          return false;
        } catch (e) {
          console.log("To switch to Ethereum Mainnet, use metamask");
          return false;
        }
      }

      const network = this.networks.find(
        (item) => item.switchData.chainId === targetChainId
      );

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [network.switchData],
      });
    },
    switchNetworkWithoutConnect(chainId) {
      localStorage.setItem("MAGIC_MONEY_CHAIN_ID", chainId);
      window.location.reload();
    },
  },
};
