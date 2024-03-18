<template>
  <div class="user-deposits">
    <h3 class="user-deposits-title">Your deposits</h3>

    <BlastStatisticsCarousel
      :stakeInfo="stakeInfo"
      :cauldronInfo="cauldronInfo"
      :isLockedPosition="isLockedPosition"
      :isUnlockedPosition="isUnlockedPosition"
      :isCauldronPosition="isCauldronPosition"
      v-if="isLockedPosition || isUnlockedPosition || isCauldronPosition"
    />

    <BaseSearchEmpty class="empty" v-else />
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
    isLockedPosition() {
      const [usdb, mim] = this.stakeInfo.tokensInfo;
      return (
        usdb.userInfo.balances.locked > 0 || mim.userInfo.balances.locked > 0
      );
    },

    isUnlockedPosition() {
      const [usdb, mim] = this.stakeInfo.tokensInfo;
      return (
        usdb.userInfo.balances.unlocked > 0 ||
        mim.userInfo.balances.unlocked > 0
      );
    },

    isCauldronPosition() {
      return this.cauldronInfo?.userPosition?.collateralDeposited > 0;
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
    BaseSearchEmpty: defineAsyncComponent(() =>
      import("@/components/base/BaseSearchEmpty.vue")
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

.user-deposits {
  max-width: 411px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.user-deposits-title {
  font-size: 24px;
  font-weight: 500;
}

.empty {
  padding: 0px 0px !important;
}

@media (max-width: 600px) {
  .user-deposits {
    padding: 16px;
  }
}
</style>
