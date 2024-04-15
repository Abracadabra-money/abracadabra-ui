<template>
  <li class="user-lock">
    <div class="lp-token">
      <BaseTokenIcon />
      <div class="token-amount">
        <span class="value">1,452,425.43</span>
        <span class="usd">$0.00</span>
      </div>
    </div>

    <div class="timer-wrap">
      <Timer small :endDateTimestamp="1713551390" />
      <span class="description">Unlocks in</span>
    </div>
  </li>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";

export default {
  props: {
    unlockTimestamp: { type: Number },
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
