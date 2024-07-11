<template>
  <div :class="['price-selector-wrap', { disabled: isPriceSelectorDisabled }]">
    <div class="price-selector-header">
      <h4 class="action-title">
        Initial Price
        <Tooltip />
      </h4>

      <BaseCheckBox
        :chosen="isAutoPricingEnabled"
        :disabled="isPriceSelectorDisabled"
        @update="$emit('toggleAutopricing')"
        v-if="!isPriceSelectorDisabled"
      >
        <span class="checkbox-text">Auto pricing</span>
        <img class="gecko-icon" src="@/assets/images/coingecko-icon.svg" />
      </BaseCheckBox>
    </div>

    <div class="price-selector">
      <img
        :class="['switch-icon', { disabled: isPriceSelectorDisabled }]"
        src="@/assets/images/pools/pool-creation/switch-icon.svg"
        @click="isFromBase = !isFromBase"
      />

      <div class="comparable-token-wrap">
        1
        <div class="token-info">
          <BaseTokenIcon
            :icon="comparedCurrency.icon"
            :name="comparedCurrency.name"
            size="24px"
          />
          <span class="token-name">{{ comparedCurrency.name }}</span>
        </div>
      </div>
      =
      <RateInput
        class="price-input"
        v-model="inputValue"
        :name="benchmarkCurrency.name"
        :icon="benchmarkCurrency.icon"
        :isProgrammaticallyChanged="isProgrammaticallyChanged"
        :disabled="isPriceSelectorDisabled || isAutoPricingEnabled"
        @toggleProgrammaticalyChange="isProgrammaticallyChanged = false"
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
    isAutoPricingEnabled: Boolean,
  },

  data() {
    return {
      inputValue: 0,
      userTokenRate: 0,
      isFromBase: true,
      isProgrammaticallyChanged: false,
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

    comparedCurrency() {
      return this.isFromBase ? this.baseToken.config : this.quoteToken.config;
    },

    benchmarkCurrency() {
      return !this.isFromBase ? this.baseToken.config : this.quoteToken.config;
    },

    autoTokenRate() {
      if (this.isPriceSelectorDisabled || !this.isAutoPricingEnabled) return 0;
      const baseQuoteRate = this.baseToken.price / this.quoteToken.price;
      return this.isFromBase ? baseQuoteRate : 1 / baseQuoteRate;
    },
  },

  watch: {
    isAutoPricingEnabled() {
      this.setInputValue(this.autoTokenRate || this.userTokenRate);
    },

    inputValue(value: number) {
      if (
        !this.isAutoPricingEnabled &&
        !this.isProgrammaticallyChanged &&
        value
      ) {
        this.userTokenRate = 1 / value;
      }
    },

    isFromBase() {
      if (this.isAutoPricingEnabled) {
        this.userTokenRate = this.autoTokenRate;
        this.setInputValue(this.autoTokenRate);
      } else if (this.userTokenRate) {
        this.setInputValue(this.userTokenRate);
        this.userTokenRate = 1 / this.userTokenRate;
      }
    },

    userTokenRate(userRate: number) {
      const rateToEmit = this.isFromBase ? userRate : 1 / userRate;
      if (this.inputValue && !this.isAutoPricingEnabled)
        this.$emit("updateTokensRate", rateToEmit);
    },

    autoTokenRate(autoRate: number) {
      const rateToEmit = this.isFromBase ? autoRate : 1 / autoRate;
      if (this.isAutoPricingEnabled) this.$emit("updateTokensRate", rateToEmit);
    },
  },

  methods: {
    setInputValue(newValue: number) {
      this.isProgrammaticallyChanged = true;
      this.inputValue = newValue;
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    RateInput: defineAsyncComponent(
      () =>
        import("@/components/pools/poolCreation/priceSelector/RateInput.vue")
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

.token-icon,
.price-input::v-deep(.token-icon) {
  margin-right: 0 !important;
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
