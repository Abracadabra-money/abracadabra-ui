<template>
  <div class="slide">
    <div class="slide-head">
      <div class="title-wrap">
        <div>
          <h3 class="slide-title">Add a WBTC and WETH Market</h3>
          <h4 class="slide-subtitle">
            <ClockIcon />
            Jun 25 9:00 PM - Jun 26 9:00 PM
          </h4>
        </div>

        <div class="status">Active</div>
      </div>

      <a
        class="snapshot-link"
        href="http://"
        target="_blank"
        rel="noopener noreferrer"
        >Snapshot <ArrowTopRight :width="12" :height="12" fill="#7088CC"
      /></a>
    </div>
    <div class="slide-body">
      <div class="description">
        Add a new BTC and WETH market on Arbitrum, to allow market makers to
        borrow MIM and pair it with USDT and USDC to improve liquidity for MIM
        on chain.Add a new BTC and WETHMIM and pair it with USDT and USDC to
        improve liquidity for MIM on chain.Add a new BTC and...
      </div>
      <div class="survey-wrap">
        <div class="survey">
          <div class="survey-head">
            <h3 class="survey-title">Yes, Ut enim ad minima veniam...</h3>
            <span class="survey-percent">75%</span>
          </div>
          <div class="track">
            <div class="indicator"></div>
          </div>
        </div>
        <div class="survey">
          <div class="survey-head">
            <h3 class="survey-title">Yes, Ut enim ad minima veniam...</h3>
            <span class="survey-percent">25%</span>
          </div>
          <div class="track">
            <div style="width: 25%" class="indicator"></div>
          </div>
        </div>
        <div class="survey">
          <div class="survey-head">
            <h3 class="survey-title">Quorum</h3>
            <span class="survey-percent">4.3B / 3B</span>
          </div>
          <div class="track">
            <div style="width: 100%" class="indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "vue3-carousel/dist/carousel.css";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    ClockIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ClockIcon.vue")
    ),
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.slide {
  padding: 16px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.24) 0%,
      rgba(116, 92, 210, 0.24) 100%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.slide-head {
  border: 1px solid #00296b;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title-wrap {
  gap: 12px;
  display: flex;
}

.slide-title {
  text-align: start;
  font-size: 16px;
  font-weight: 500;
}

.slide-subtitle {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
}

.snapshot-link {
  padding: 5px 8px;
  color: #7088cc;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: #1a1f3d;
}

.slide-body {
  gap: 12px;
  display: flex;
  justify-content: space-between;
  text-align: start;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
  width: 110%;
}

.survey-wrap {
  width: 100%;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.survey-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.survey-title,
.survey-percent {
  font-size: 14px;
  font-weight: 500;
}

.track {
  width: 100%;
  height: 10px;
  border-radius: 12px;
  background: rgba(112, 136, 204, 0.2);
}

.indicator {
  width: 75%;
  height: 10px;
  border-radius: 12px;
  background: var(
    --Primary-Gradient,
    linear-gradient(90deg, #2d4a96 0%, #745cd2 100%)
  );
}
</style>
