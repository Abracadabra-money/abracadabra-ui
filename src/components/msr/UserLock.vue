<template>
  <li class="user-lock">
    <div class="token-amount">
      <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
      {{ locked }}
    </div>

    <div class="timer-wrap" v-if="lockStatus.title == 'active'">
      <Timer
        class="timer"
        :endDateTimestamp="Number(userLock.unlockTime)"
        small
        medium
      />
      <p class="timer-description">Unlocks in</p>
    </div>

    <div class="lock-status-wrap" v-else>
      <Tooltip fill="#67A069" v-if="userLock?.fromStorage" />
      <img class="status-image" :src="lockStatus.image" v-else />
      <span :class="['status-title', { unlocked: userLock?.fromStorage }]">{{
        lockStatus.title
      }}</span>
    </div>
  </li>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import moment from "moment";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { formatTokenBalance } from "@/helpers/filters";
import { formatUnits } from "viem";
import { useImage } from "@/helpers/useImage";
import type { UserLock } from "@/helpers/mimSavingRate/getUserInfo";

export default {
  props: {
    userLock: {
      type: Object as PropType<UserLock & { decimals: number }>,
      required: true,
    },
  },

  data() {
    return {
      mimIcon,
      now: null as any,
      intervalId: null as null | NodeJS.Timeout,
    };
  },

  computed: {
    locked() {
      return formatTokenBalance(
        formatUnits(this.userLock.amount, this.userLock.decimals)
      );
    },

    lockStatus() {
      const duration = moment.duration(this.unlockDate.diff(this.now));

      if (duration.asSeconds() <= 0)
        return {
          title: this.userLock?.fromStorage ? "unlocked" : "unlocking",
          image: useImage("assets/images/msr/lock-status/unlocking.png"),
        };

      return {
        title: "active",
        image: "",
      };
    },

    unlockDate() {
      return moment.utc(Number(this.userLock.unlockTime) * 1000);
    },
  },

  methods: {
    updateNow() {
      this.now = moment().utc();
    },
  },

  mounted() {
    this.updateNow();
    this.intervalId = setInterval(this.updateNow, 1000);
  },

  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
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

.lock-status-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-title {
  text-transform: capitalize;
}

.unlocked {
  color: #67a069;
}
</style>
