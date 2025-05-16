<template>
  <div :class="['price-selector-wrap', { disabled: isPriceSelectorDisabled }]">
    <div class="price-selector-header">
      <h4 class="action-title">Initial Price</h4>

      <template v-if="!isPriceSelectorDisabled">
        <BaseCheckBox
          :checked="isAutoPricingEnabled"
          :disabled="isPriceSelectorDisabled"
          @update="$emit('toggleAutopricing', !isAutoPricingEnabled, true)"
          v-if="isAutoPricingPossible"
        >
          <span class="checkbox-text">Auto pricing</span>
          <img
            class="price-source-icon"
            src="@/assets/images/defilama-icon.svg"
          />
        </BaseCheckBox>

        <div class="autopricing-warning" v-else>
          <img
            class="warning-icon"
            src="@/assets/images/pools/pool-creation/warning-triangle.svg"
          />
          Warning
        </div>
      </template>
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
            :name="comparedCurrency.symbol"
            size="24px"
          />
          <span
            class="token-name"
            v-if="comparedCurrency.symbol != 'Select Token'"
          >
            {{ comparedCurrency.symbol }}
          </span>
        </div>
      </div>
      =
      <RateInput
        class="price-input"
        :value="inputValue"
        :name="benchmarkCurrency.symbol"
        :icon="benchmarkCurrency.icon"
        :disabled="isPriceSelectorDisabled || isAutoPricingEnabled"
        @updateInputValue="updateUserTokenRate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import { formatUnits, parseUnits } from "viem";
import { RATE_DECIMALS, RATE_PRECISION } from "@/constants/pools/poolCreation";

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
      inputValue: "",
      userTokenRate: 0n,
      isFromBase: true,
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
      if (this.isPriceSelectorDisabled || !this.isAutoPricingPossible)
        return 0n;

      const basePriceBigInt = parseUnits(
        this.baseToken.price.toString(),
        RATE_DECIMALS
      );
      const quotePriceBigInt = parseUnits(
        this.quoteToken.price.toString(),
        RATE_DECIMALS
      );

      return (basePriceBigInt * RATE_PRECISION) / quotePriceBigInt;
    },

    isAutoPricingPossible() {
      return !!this.baseToken.price && !!this.quoteToken.price;
    },
  },

  watch: {
    isAutoPricingPossible: {
      handler(value: boolean) {
        if (value) {
          this.$emit("toggleAutopricing", true);
          this.updateInputValue();
        } else {
          this.$emit("toggleAutopricing", false);
        }
      },
      immediate: true,
    },

    baseToken: {
      handler() {
        this.updateInputValue();
      },
      deep: true,
      immediate: true,
    },

    quoteToken: {
      handler() {
        this.updateInputValue();
      },
      deep: true,
      immediate: true,
    },

    isAutoPricingEnabled: {
      handler(value: boolean) {
        if (!value) {
          this.userTokenRate = this.autoTokenRate;
        } else {
          this.$emit("updateTokensRate", this.autoTokenRate);
        }
        this.updateInputValue();
      },
      immediate: true,
    },

    isFromBase: {
      handler() {
        this.updateInputValue();
      },
      immediate: true,
    },

    userTokenRate(userRate: bigint) {
      if (!this.isAutoPricingEnabled) this.$emit("updateTokensRate", userRate);
    },

    autoTokenRate(autoRate: bigint) {
      this.$emit("updateTokensRate", autoRate);
    },
  },

  methods: {
    async updateInputValue() {
      const rateToRender = this.calculateRateToRender(
        this.isAutoPricingEnabled ? this.autoTokenRate : this.userTokenRate,
        this.isFromBase,
        RATE_PRECISION
      );
      const valueToRender = formatUnits(rateToRender, RATE_DECIMALS);
      const newValue = parseFloat(
        Number(valueToRender).toFixed(this.benchmarkCurrency.decimals)
      ).toString();

      this.inputValue = "";
      // Затем в следующем тике устанавливаем нужное значение
      await this.$nextTick();
      this.inputValue = newValue;
    },

    updateUserTokenRate(amount: bigint) {
      if (!amount) {
        this.userTokenRate = 0n;
      } else {
        this.userTokenRate = this.isFromBase
          ? amount
          : (RATE_PRECISION * RATE_PRECISION) / amount;
      }
    },

    calculateRateToRender(
      rate: bigint,
      isFromBase: boolean,
      ratePrecision: bigint = RATE_PRECISION
    ) {
      if (!rate) return 0n;
      return isFromBase ? rate : (ratePrecision * ratePrecision) / rate;
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

.autopricing-warning {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 2px 12px;
  border-radius: 16px;
  border: 1px solid #fed84f;
  background: rgba(254, 216, 79, 0.4);
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
