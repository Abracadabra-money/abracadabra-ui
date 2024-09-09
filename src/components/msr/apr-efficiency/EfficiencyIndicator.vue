<template>
  <div class="efficiency-progress">
    <div class="anim" ref="anim"></div>
    <div class="efficiency-info">
      <p class="title">Your APR</p>
      <RowSkeleton v-if="isMimSavingRateInfoLoading && !isMimSavingRateInfo" />
      <p class="percent" v-else>{{ formatPercent(userApr) }}</p>
    </div>
    <div class="edge-percents">
      <span class="edge-percent base">{{ formatPercent(baseApr) }}</span>
      <span class="edge-percent boosted">{{ formatPercent(boostedApr) }}</span>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import LottiePlayer from "lottie-web";
import { formatPercent } from "@/helpers/filters";

const TOTAL_FRAMES = 90;

export default {
  props: {
    aprEfficiency: { type: [Number, String], default: 0 },
    userApr: { type: [Number, String], default: 0 },
    baseApr: { type: [Number, String], default: 0 },
    boostedApr: { type: [Number, String], default: 0 },
    isMimSavingRateInfoLoading: { type: Boolean },
    isMimSavingRateInfo: { type: Boolean, default: false },
    isDeposit: { type: Boolean },
  },

  data() {
    return {
      animation: null,
    };
  },

  methods: {
    formatPercent,

    initAnimation() {
      const { anim } = this.$refs;

      const path = this.isDeposit
        ? `/apr-efficiency-mim.json`
        : `/apr-efficiency.json`;

      this.animation = LottiePlayer.loadAnimation({
        renderer: "svg",
        loop: false,
        autoplay: false,
        path,
        container: anim,
      });

      this.animation.goToAndStop(
        (TOTAL_FRAMES / 100) * this.aprEfficiency,
        true
      );
    },
  },

  async mounted() {
    this.initAnimation();
  },

  beforeUpdate() {
    this.animation.destroy();
    this.initAnimation();
  },

  components: {
    RowSkeleton: defineAsyncComponent(() =>
      import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.efficiency-progress {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 215px;
  max-height: 128px;
}

.anim {
  max-height: 120px;
}

.efficiency-info {
  position: absolute;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.percent {
  font-size: 29px;
  font-weight: 600;
}

.title {
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.position-risk {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  width: 97px;
  padding: 2px 12px;
  border-radius: 12px;
  text-transform: capitalize;
  font-size: 16px;
  font-weight: 400;
}

.edge-percents {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 215px;
  width: 100%;
  margin-top: -8px;
}

.edge-percent {
  color: #878b93;
  font-size: 14px;
  font-weight: 400;
}

.safe {
  background-color: #67a069;
}

.medium {
  background-color: #ddc237;
}

.high {
  background-color: #8c4040;
}

.row-skeleton {
  height: 28px !important;
  padding: 15px 0 !important;
}

@media (max-width: 500px) {
  .edge-percents {
    max-width: 250px;
    margin-top: 16px;
  }
}
</style>
