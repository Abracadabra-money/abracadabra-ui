<template>
  <div class="swap-info">
    <div class="swap-info-item">
      <div class="info-title">Current price</div>
      <div class="info-value">
        <SwapIcon fill="#7088CC" />
        <span>1 GLP = 1,636.39 ETH</span>
        <span class="info-price">($1,687.87)</span>
      </div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Price Impact</div>
      <div class="info-value">93.00%</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Minimum received</div>
      <div class="info-value">0.242371 DAI</div>
    </div>
    <div class="swap-info-item">
      <div class="info-title">Network Fee</div>
      <div class="info-value"><FeeIcon /> $0.01</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    SwapIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SwapIcon.vue")
    ),
    FeeIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/FeeIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.swap-info {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.swap-info-item {
  display: flex;
  justify-content: space-between;
  color: #878b93;
  line-height: normal;
  flex-wrap: wrap;
}

.info-value {
  font-weight: 500;
  gap: 4px;
  display: flex;
  align-items: center;
}

.info-price {
  color: #575c62;
}
</style>