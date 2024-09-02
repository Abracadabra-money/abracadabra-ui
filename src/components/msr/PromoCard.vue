<template>
  <div class="lock-promo-wrap">
    <div class="decorative-wrap external">
      <div class="decorative-wrap internal">
        <div class="promo-text-wrap">
          <p class="promo-text">
            Staking allows for instant withdrawls, while the lock option
            provides a boosted APR
          </p>
        </div>
      </div>
    </div>

    <div class="apr-wrap">
      <h4 class="apr-title">APR Range</h4>
      <RowSkeleton v-if="isMimSavingRateInfoLoading" />
      <div class="apr-range" v-else>
        <div class="apr">
          <span class="apr-value">{{ formatPercent(defaultApr) }}</span>
          <span class="apr-subtitle">Staked APR</span>
        </div>
        <span class="dash">-</span>
        <div class="apr">
          <span class="apr-value">{{ formatPercent(boostedApr) }}</span>
          <span class="apr-subtitle">Locked APR</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatPercent, formatTokenBalance } from "@/helpers/filters";
import { formatUnits } from "viem";
import mimIcon from "@/assets/images/tokens/MIM.png";

export default {
  props: {
    mimSavingRateInfo: {
      type: null as any,
      default: null,
      required: false,
    },
    isMimSavingRateInfoLoading: { type: Boolean },
  },

  data() {
    return {
      mimIcon,
    };
  },

  computed: {
    defaultApr() {
      return this.mimSavingRateInfo?.baseApr || 0;
    },

    boostedApr() {
      return this.defaultApr * 3;
    },

    isStake() {
      return true;
      if (this.isMimSavingRateInfoLoading) return false;
      const { unlocked } = this.mimSavingRateInfo!.userInfo.balances;
      return unlocked > 0n;
    },
  },

  methods: {
    formatPercent,

    formatAmount(amount: bigint) {
      return formatTokenBalance(
        formatUnits(amount, this.mimSavingRateInfo?.stakingToken.decimals || 18)
      );
    },
  },

  components: {
    RowSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/RowSkeleton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.lock-promo-wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 191px;
  width: 100%;
  border-radius: 16px;
  border: 1px rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    291deg,
    #102649 -26.37%,
    #0c0f1c 40.92%,
    #131728 62.83%,
    #212555 123.87%
  );
  overflow: hidden;
}

.decorative-wrap,
.promo-text-wrap {
  height: 100%;
  border-radius: 0px 120px 120px 0px;
}

.external {
  position: relative;
  display: flex;
  align-items: center;
  top: -7px;
  left: 0;
  padding: 0 12px 0 0;
  max-width: 326px;
  height: 254px;
  border-right: 3px solid #745cd24d;
}

.internal {
  display: flex;
  align-items: center;
  max-width: 314px;
  height: 244px;
  padding: 0 8px 0 0;
  border-right: 4px solid #745cd2ad;
}

.promo-text-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 235px;
  width: 302px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.promo-text {
  width: 266px;
  padding-left: 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 30px;
}

.apr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  gap: 16px;
}

.apr-title {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}

.apr-range {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.apr {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.apr-value,
.dash {
  font-size: 38px;
  font-weight: 600;
  line-height: 50px;
}

.apr-subtitle {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .lock-promo-wrap {
    flex-direction: column;
    gap: 19px;
    padding: 0 0 20px 0;
    height: auto;
    overflow-x: hidden;
  }

  .decorative-wrap,
  .promo-text-wrap {
    max-width: 100%;
    height: auto;
    border-radius: 0 0 120px 120px;
  }

  .external {
    top: 0;
    display: flex;
    align-items: center;
    min-width: calc(100% + 40px);
    height: auto;
    padding: 0 0 12px 0;
    border-right: none;
    border-bottom: 3px solid #745cd24d;
  }

  .internal {
    display: flex;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 0 0 8px 0;
    border-right: none;
    border-bottom: 3px solid #745cd2ad;
  }

  .promo-text-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    width: 100%;
    background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  }

  .promo-text {
    width: 266px;
    height: auto;
    padding-left: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    text-align: center;
  }
}
</style>
