<template>
  <div class="liquidity-info">
    <div class="header">
      <div class="title-subtitle">
        <h3 class="title">MIM Swap</h3>
        <p class="subtitle">Liquidity Launch Event</p>
      </div>

      <div class="timer">
        <div class="time-block day"><span>13d</span></div>
        <div class="time-block hour"><span>12h</span></div>
        <div class="time-block minute"><span>12m</span></div>
        <div class="time-block second"><span>55s</span></div>
      </div>
    </div>

    <div class="fill-indicators">
      <div class="fill-indicator usdb">
        <BaseTokenIcon :icon="usdbIcon" name="USDB" size="32px" />

        <div class="scale-wrap">
          <div class="filling-scale" style="width: 50%"></div>
          <div class="filled-amount">2,000 out of 4,000</div>
        </div>
      </div>

      <div class="fill-indicator mim">
        <BaseTokenIcon :icon="mimIcon" name="MIM" size="32px" />

        <div class="scale-wrap">
          <div class="filling-scale" style="width: 20%"></div>
          <div class="filled-amount">1,000 out of 4,000</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import mimIcon from "@/assets/images/tokens/MIM.png";
import usdbIcon from "@/assets/images/tokens/USDB.png";

export default {
  data() {
    return { mimIcon, usdbIcon };
  },

  components: { BaseTokenIcon },
};
</script>

<style lang="scss" scoped>
.liquidity-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-subtitle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.subtitle {
  font-size: 14px;
  font-weight: 400;
}

.timer {
  display: flex;
  gap: 12px;
}

.time-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 56px;
  padding: 6px 11px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(0, 10, 35, 0.3);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-size: 29px;
  font-weight: 500;
}

.fill-indicators {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.fill-indicator {
  display: flex;
  align-items: center;
}

.scale-wrap {
  position: relative;
  width: 100%;
  height: 24px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.filling-scale {
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.filled-amount {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}
</style>
