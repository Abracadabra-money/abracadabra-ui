import poolsInfo from "@/utils/borrowPools/pools";
import { mapGetters } from "vuex";
import { ethers } from "ethers";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({ chainId: "getChainId" }),
  },
  methods: {
    async createPools() {
      //   if (this.account) {
      //     if (!this.$store.getters.getPools.length) {
      //       this.setLoadingPoolsBorrow(true);
      //     }

      let targetChainId = ethers.utils.hexlify(this.chainId);

      console.log("ffffffffff", targetChainId);

      const chainPools = poolsInfo.filter(
        (pool) => pool.contractChain === targetChainId
      );

      console.log("333333333333", chainPools);

      const pools = await Promise.all(
        chainPools.map((pool) => this.createPool(pool))
      );

      //   this.setLoadingPoolsBorrow(false);
      this.$store.commit("setPools", pools);
      //   } else {
      //     this.setLoadingPoolsBorrow(false);
      //   }
    },
  },
  created() {
    this.createPools();
  },
};
