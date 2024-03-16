<template>
  <div class="user-deposits">
    <h3 class="user-deposits-title">Your deposits</h3>
    <BlastStatisticsCarousel :stakeInfo="stakeInfo" />
  </div>
</template>

<script>
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import { defineAsyncComponent } from "vue";
import mimUsdbIcon from "@/assets/images/tokens/MIM-USDB.png";

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
      mimUsdbIcon,
    };
  },

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },
  },

  components: {
    PoolCard: defineAsyncComponent(() =>
      import("@/components/blastStatistics/cards/PoolCard.vue")
    ),
    BlastCauldronCard: defineAsyncComponent(() =>
      import("@/components/blastStatistics/cards/BlastCauldronCard.vue")
    ),
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
