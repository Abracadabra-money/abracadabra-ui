<template>
  <div :class="['price-selector-wrap', { disabled: isPriceSelectorDisabled }]">
    <div class="price-selector-header">
      <h4 class="action-title">
        Initial Price
        <Tooltip tooltip="tooltip" />
      </h4>

      <template v-if="!isPriceSelectorDisabled">
        <BaseCheckBox
          :chosen="isAutoPricingEnabled"
          :disabled="isPriceSelectorDisabled"
          @update="$emit('toggleAutopricing')"
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
            >{{ comparedCurrency.symbol }}</span
          >
        </div>
      </div>
      =
      <RateInput
        class="price-input"
        :value="inputValue"
        :name="benchmarkCurrency.symbol"
        :icon="benchmarkCurrency.icon"
        :disabled="isPriceSelectorDisabled || isAutoPricingEnabled"
        @updateInputValue="updateInputValue"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import { formatUnits, parseUnits } from "viem";
import { RATE_DECIMALS, RATE_PRECISION } from "@/constants/pools/poolCreation";
import { trimZeroDecimals } from "@/helpers/numbers";

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
      inputAmount: 0n,
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
      if (this.isPriceSelectorDisabled || !this.isAutoPricingEnabled) return 0n;
      const basePriceBigInt = parseUnits(
        this.baseToken.price.toString(),
        RATE_DECIMALS
      );
      const quotePriceBigInt = parseUnits(
        this.quoteToken.price.toString(),
        RATE_DECIMALS
      );

      const baseQuoteRate =
        (basePriceBigInt * RATE_PRECISION) / quotePriceBigInt;
      return this.isFromBase
        ? baseQuoteRate
        : (RATE_PRECISION * RATE_PRECISION) / baseQuoteRate;
    },

    isAutoPricingPossible() {
      return this.baseToken.price && this.quoteToken.price;
    },
  },

  watch: {
    isAutoPricingEnabled: {
      immediate: true,
      handler() {
        this.setInputValue(
          formatUnits(this.autoTokenRate || this.userTokenRate, RATE_DECIMALS)
        );
      },
    },

    isPriceSelectorDisabled(value: boolean) {
      if (!value && this.isAutoPricingPossible) this.$emit("toggleAutopricing");
    },

    inputAmount(amount: bigint) {
      if (!this.isAutoPricingEnabled && amount) {
        this.userTokenRate = (RATE_PRECISION * RATE_PRECISION) / amount;
      }
    },

    isFromBase() {
      if (!this.isAutoPricingPossible) return;
      if (this.isAutoPricingEnabled) {
        this.userTokenRate = this.autoTokenRate;
        this.setInputValue(formatUnits(this.autoTokenRate, RATE_DECIMALS));
      } else if (this.userTokenRate) {
        this.setInputValue(formatUnits(this.userTokenRate, RATE_DECIMALS));
        this.userTokenRate =
          (RATE_PRECISION * RATE_PRECISION) / this.userTokenRate;
      }
    },

    userTokenRate(userRate: bigint) {
      const rateToEmit = this.isFromBase
        ? userRate
        : (RATE_PRECISION * RATE_PRECISION) / userRate;
      if (this.inputValue && !this.isAutoPricingEnabled)
        this.$emit("updateTokensRate", rateToEmit);
    },

    autoTokenRate(autoRate: bigint) {
      if (autoRate) {
        this.userTokenRate = autoRate;
        this.setInputValue(formatUnits(autoRate, RATE_DECIMALS));
        const rateToEmit = !this.isFromBase
          ? autoRate
          : (RATE_PRECISION * RATE_PRECISION) / autoRate;
        this.$emit("updateTokensRate", rateToEmit);
      }
    },
  },
  methods: {
    setInputValue(newValue: string = "") {
      this.inputValue = newValue;
    },

    updateInputValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = 0n;
      } else {
        this.inputAmount = amount;
        this.inputValue = trimZeroDecimals(formatUnits(amount, RATE_DECIMALS));
      }
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
