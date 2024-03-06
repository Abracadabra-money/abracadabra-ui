<template>
  <div class="pool-composition-wrap">
    <div class="pool-composition-header">
      <h3 class="title">Pool composition</h3>
      <span class="tvl">TVL $ 5.46M</span>
    </div>

    <div class="pool-composition">
      <div class="pair-tokens">
        <div class="token-info base">
          <BaseTokenIcon />
          <div class="token-part-values">
            <span class="percent">60.44%</span>
            <span class="amount">5.56M</span>
          </div>
        </div>

        <div class="token-info quote">
          <BaseTokenIcon />
          <div class="token-part-values">
            <span class="percent">39.66%</span>
            <span class="amount">2.56M</span>
          </div>
        </div>
      </div>

      <div class="scale-wrap">
        <div class="filling-scale" :style="`width: 60.44%`"></div>
      </div>
    </div>

    <div class="pool-composition-info">
      <div class="info-tag">
        <span class="info-tag-title">
          Volume 24h
          <Tooltip
            :tooltip="'Annual Return on Staked tokens at current price'"
          />
        </span>
        <span class="value">312312</span>
      </div>

      <div class="divider"></div>

      <div class="info-tag">
        <span class="info-tag-title">
          Fees 24h
          <Tooltip :tooltip="'Total Value Locked in Farm'" />
        </span>
        <span class="value">132000.09</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
  },

  computed: {},

  components: {
    Tooltip: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-composition-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.pool-composition-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.tvl {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

.pool-composition {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pair-tokens {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.token-info {
  display: flex;
  align-items: center;
}

.quote {
  flex-direction: row-reverse;
}

.token-part-values {
  display: flex;
  flex-direction: column;
}

.base .token-part-values {
  align-items: flex-start;
}

.quote .token-part-values {
  align-items: flex-end;
  margin-right: 10px;
}

.percent {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

.amount {
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
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

.pool-composition-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 20px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.info-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  width: 50%;
}

.info-tag-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.divider {
  width: 1px;
  height: 29px;
  background: rgba(255, 255, 255, 0.72);
  margin: 0 13px;
}
</style>
