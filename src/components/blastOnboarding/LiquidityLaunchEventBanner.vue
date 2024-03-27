<template>
  <div class="banner" v-if="showBanner">
    <div class="banner-info">
      <div class="icons">
        <img
          class="blast icon"
          src="@/assets/images/points-dashboard/blast.png"
          alt=""
        />
        <img
          class="gold-points icon"
          src="@/assets/images/points-dashboard/gold-points.svg"
          alt=""
        />
        <img
          class="potion icon"
          src="@/assets/images/points-dashboard/potion.png"
          alt=""
        />
      </div>

      <div class="title-desc">
        <h4 class="title">Liquidity Launch Event Phase 3 ending soon!</h4>
        <p class="description">
          Last chance to become a Founder & earn extra rewards by locking your
          MIM/USDB MLP for 3 months
        </p>
      </div>
    </div>

    <div class="timer-wrap">
      <Timer class="timer" :endDateTimestamp="1711562400" small medium />
      <p class="timer-description">Time left to lock</p>
    </div>

    <img
      class="close"
      src="@/assets/images/close.svg"
      alt="close"
      @click="showBanner = false"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      showBanner: true,
    };
  },

  components: {
    Timer: defineAsyncComponent(() =>
      import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.banner {
  display: flex;
  justify-content: start;
  align-items: center;

  padding: 16px 22px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.52) 0%,
    rgba(116, 92, 210, 0.52) 100%
  );
  backdrop-filter: blur(19.600000381469727px);
}

.icons {
  display: flex;
  align-items: center;
}

.icon {
  height: 44px;
  width: 44px;
  margin-left: -14px;
  border: 2px solid #000;
  border-radius: 50px;
  transition: transform 0.1s ease-in;
}

.icon:hover {
  transform: translateY(-4px);
  z-index: 1;
}

.blast {
  margin-left: 0;
}

.banner-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-desc {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.title {
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
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
}

.close {
  align-self: self-start;
  margin-left: 24px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.close:hover {
  opacity: 0.7;
}
</style>
