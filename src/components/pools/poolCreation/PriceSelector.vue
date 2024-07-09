<template>
  <div :class="['price-selector-wrap', { disabled: isPriceSelectorDisabled }]">
    <div class="price-selector-header">
      <h4 class="action-title">
        Initial Price
        <Tooltip />
      </h4>

      <BaseCheckBox
        :chosen="isAutoPricing"
        :disabled="isPriceSelectorDisabled"
        @update="isAutoPricing = !isAutoPricing"
      >
        <span class="checkbox-text">Auto pricing</span>
        <img class="gecko-icon" src="@/assets/images/coingecko-icon.svg" />
      </BaseCheckBox>
    </div>

    <div class="price-selector">
      <img
        :class="['switch-icon', { disabled: isPriceSelectorDisabled }]"
        src="@/assets/images/pools/pool-creation/switch-icon.svg"
      />

      <div class="comparable-token-wrap">
        1
        <div class="token-info">
          <BaseTokenIcon size="24px" />
          <span class="token-name">ETH</span>
        </div>
      </div>
      =
      <BaseTokenInput
        class="price-input"
        compact
        :disabled="isPriceSelectorDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";

export default {
  props: {
    baseToken: {
      type: Object as PropType<PoolCreationTokenInfo>,
      required: true,
    },
    quoteToken: {
      type: Object as PropType<PoolCreationTokenInfo>,
      required: true,
    },
  },

  data() {
    return {
      isAutoPricing: false,
    };
  },

  computed: {
    isPriceSelectorDisabled() {
      const emptyTokenName = "Select Token";
      return (
        this.baseToken.config.name == emptyTokenName ||
        this.quoteToken.config.name == emptyTokenName
      );
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseCheckBox: defineAsyncComponent(
      () => import("@/components/base/BaseCheckBox.vue")
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

.price-selector-wrap.disabled {
  opacity: 0.5;
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
}

.switch-icon:hover:not(.disabled) {
  cursor: pointer;
  animation: rotateAndReturn 1s ease-in-out;
}

.price-selector {
  display: flex;
  align-items: center;
  justify-content: center;
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

.price-input {
  max-width: 319px;
}

@media (max-width: 1200px) {
  .price-input::v-deep(.val-input) {
    padding: 8px 12px;
  }

  .price-input::v-deep(.token-name),
  .token-name {
    display: none;
  }
  .price-input::v-deep(.token-icon),
  .token-icon {
    margin-right: 0 !important;
  }
}

@keyframes rotateAndReturn {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(90deg);
  }
  80% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
