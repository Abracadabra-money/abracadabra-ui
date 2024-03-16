<template>
  <div class="user-deposits" v-if="isPoolPosition || isCauldronPosition">
    <h3 class="user-deposits-title">Your deposits</h3>
    <BlastStatisticsCarousel
      :stakeInfo="stakeInfo"
      :cauldronInfo="cauldronInfo"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    pointsStatistics: {
      type: Object,
      requared: true,
    },
  },

  data() {
    return {
      cauldronInfo: null,
      cauldronChainId: 81457,
      cauldronId: 1,
      updateInterval: null,
    };
  },

  computed: {
    isPoolPosition() {
      return this.stakeInfo.userLpInfo.balance;
    },

    isCauldronPosition() {
      return this.cauldronInfo?.userPosition?.collateralDeposited;
    },
  },

  methods: {
    async createCauldronInfo() {
      const currentRpc = defaultRpc[this.cauldronChainId];

      const chainProvider = new providers.StaticJsonRpcProvider(currentRpc);

      this.cauldronInfo = await getCauldronInfo(
        this.cauldronId,
        this.cauldronChainId,
        chainProvider,
        chainProvider
      );
    },
  },

  async created() {
    await this.createCauldronInfo();
    this.updateInterval = setInterval(async () => {
      await this.createCauldronInfo();
    }, 60000);
  },

  components: {
    BlastStatisticsCarousel: defineAsyncComponent(() =>
      import("@/components/blastStatistics/BlastStatisticsCarousel.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.user-deposits,
.deposit-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  cursor: pointer;
}

.user-deposits-title {
  font-size: 24px;
  font-weight: 500;
}
</style>
