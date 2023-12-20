<template>
  <div class="price-range-wrap">
    <div class="current-price">
      $135.2 <TooltipIcon :width="16" :height="16" tooltip="Price" />
    </div>
    <div class="range-wrap">
      $190
      <div class="price-range">
        <div class="indicator"></div>
      </div>
      $200
      <TooltipIcon :width="16" :height="16" fill="#878B93" tooltip="Price" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.price-range-wrap {
  max-width: 600px;
  width: 100%;
  padding: 6px 16px;
  border-radius: 12px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.current-price {
  color: var(--additional-ffffff, #fff);
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  display: flex;
  align-items: center;
  gap: 3px;
  justify-content: center;
}

.range-wrap {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
}

.price-range {
  max-width: 480px;
  width: 100%;
  height: 12px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    rgba(53, 109, 55, 0.3) 0%,
    rgba(103, 160, 105, 0.3) 96.59%
  );
}

.indicator {
  width: 90%;
  border-radius: 12px;
  height: 12px;
  background: linear-gradient(90deg, #356d37 0%, #67a069 96.59%);
}
</style>
