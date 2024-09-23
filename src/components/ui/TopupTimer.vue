<template>
  <div class="topup-timer" v-if="!isEnded">
    <img src="@/assets/images/topup-bg.png" alt="" class="bg-img" />
    <div class="timer-wrap">
      <div class="timer-text">Pending Top Up</div>
      <Timer
        class="timer"
        :endDateTimestamp="endDateTimestamp"
        small
        gap="4px"
        padding="2px"
        background="rgba(0, 10, 35, 0.30)"
      />
    </div>
    <p class="subtitle">1,000,000 MIMs soon will be available to Borrow</p>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import moment from "moment";

export default {
  computed: {
    endDateTimestamp(): number {
      return 1726581600;
    },
    currentTimeUnix(): number {
      return moment.utc(Date.now()).unix();
    },
    isEnded(): boolean {
      return this.currentTimeUnix > this.endDateTimestamp;
    },
  },
  components: {
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.topup-timer {
  margin-top: -20px;
  padding: 12px 14px;
  border-radius: 12px;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;

  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

  .timer-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    position: relative;

    .timer-text {
      font-family: "Poppins", sans-serif;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.6;
    }
  }

  .subtitle {
    padding-top: 3px;
    font-family: "Poppins", sans-serif;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
