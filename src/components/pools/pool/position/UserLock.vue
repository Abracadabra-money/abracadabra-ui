<template>
  <li class="user-lock">
    <div class="lp-token">
      <BaseTokenIcon :name="pool.name" :icon="pool.icon" />
      <div class="token-amount">
        <span class="value">{{ lockAmount.value }}</span>
        <span class="usd">{{ lockAmount.usd }}</span>
      </div>
    </div>

    <div class="timer-wrap">
      <Timer small :endDateTimestamp="Number(lock.unlockTime)" />
      <span class="description">Unlocks in</span>
    </div>
  </li>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    pool: { type: Object },
    lock: { type: Object },
  },

  computed: {
    lockAmount() {
      const value = formatUnits(this.lock.amount, this.pool.decimals);
      const usd = value * this.pool.price;

      return {
        value: formatTokenBalance(value),
        usd: formatUSD(usd),
      };
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    Timer: defineAsyncComponent(() =>
      import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.user-lock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lp-token {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.value {
  margin-bottom: -8px;
  font-size: 14px;
  font-weight: 500;
}

.usd {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
}

.timer-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer::v-deep(.time-block) {
  height: 26px !important;
  min-width: auto !important;
  padding: 4px !important;
  border-radius: 10px !important;
}

.description {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}

.token-icon {
  margin-right: 0;
}
</style>
