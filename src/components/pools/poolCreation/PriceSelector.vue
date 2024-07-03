<template>
  <div class="price-selector-wrap">
    <div class="price-selector-header">
      <h4 class="action-title">
        Initial Price
        <Tooltip />
      </h4>

      <div class="checkbox-wrap">
        <span class="checkbox-text">Auto pricing</span>
        <img class="gecko-icon" src="@/assets/images/coingecko-icon.svg" />
      </div>
    </div>

    <div class="price-selector">
      <img
        class="switch-icon"
        src="@/assets/images/pools/pool-creation/switch-icon.svg"
      />

      <div class="comparable-token-wrap">
        1
        <div class="token-info">
          <BaseTokenIcon size="24px" />
          ETH
        </div>
      </div>
      =
      <BaseTokenInput compact />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.price-selector-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-text {
  font-size: 16px;
  font-weight: 400;
}

.switch-icon {
  width: 24px;
  height: 24px;
  transition: transform 1s ease-in-out;
  cursor: pointer;
}

.switch-icon:hover {
  animation: rotateAndReturn 1s ease-in-out;
}

.price-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comparable-token-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.token-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(111, 111, 111, 0.06);
  padding: 4px;
  height: 36px;
}

@keyframes rotateAndReturn {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(90deg); /* Rotate to the right */
  }
  80% {
    transform: rotate(-40deg); /* Rotate to the right */
  }
  100% {
    transform: rotate(0deg); /* Return to default position */
  }
}
</style>
