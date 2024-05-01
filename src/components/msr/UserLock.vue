<template>
  <li class="user-lock">
    <div class="token-amount">
      <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
      {{ locked }}
    </div>

    <div class="timer-wrap">
      <Timer class="timer" :endDateTimestamp="1714660482" small medium />
      <p class="timer-description">Unlocks in</p>
    </div>
  </li>
</template>

<script>
import { defineAsyncComponent } from "vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { formatTokenBalance } from "@/helpers/filters";
import { formatTimestampToUnix } from "@/helpers/time/index";
import { formatUnits } from "viem";

export default {
  props: {
    userLock: { type: Object },
  },

  data() {
    return { mimIcon };
  },

  computed: {
    locked() {
      return formatTokenBalance(
        formatUnits(this.userLock.amount, this.userLock.decimals)
      );
    },

    unlockTime() {
      return formatTimestampToUnix(
        formatUnits(this.userLock.unlockTime, 0),
        "DD MMM YYYY"
      );
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
  width: 100%;
  min-height: 58px;
  padding: 12px 16px 12px 12px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-size: 18px;
  font-weight: 500;
}

.locked-token,
.token-amount {
  display: flex;
  align-items: center;
}

.locked-token {
  gap: 12px;
}

.timer-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
}

.timer-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
}

.timer {
  gap: 4px !important;
}

.timer::v-deep(.time-block) {
  background: rgba(0, 10, 35, 0.3) !important;
  height: 26px !important;
}
</style>
