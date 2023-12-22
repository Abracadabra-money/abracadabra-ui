<template>
  <div class="wrap">
    <div class="val-input" :class="{ 'val-input-error': error }">
      <div class="token-input-wrap">
        <input
          v-model="currentValue"
          :disabled="disabled"
          class="text-field"
          type="text"
          placeholder="0.0"
        />
        <p class="usd-equivalent">{{ usdEquivalent }}</p>
      </div>

      <div class="token-input-info">
        <div class="token-info">
          <BaseTokenIcon :icon="icon" :name="name" size="28px" />
          <span class="token-name">
            {{ name }}
          </span>
        </div>

        <p class="wallet-balance">
          <img
            class="wallet-icon"
            src="@/assets/images/farm/wallet-icon.png"
            @click="currentValue = formattedMax"
            :disabled="disabled"
          />
          {{ formatTokenBalance(formattedMax) }}
        </p>
      </div>
    </div>
    <p class="value-error">
      <span v-if="error">{{ error }}</span>
      <span v-else>&nbsp;</span>
    </p>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import filters from "@/filters/index";
import { utils } from "ethers";

export default {
  props: {
    max: {
      type: BigInt,
    },
    value: {
      type: BigInt,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
    },
    icon: {
      type: String,
    },
    name: {
      type: String,
      default: "Select Farm",
    },
    lpPrice: { type: Number },
  },

  data() {
    return {
      currentValue: null,
    };
  },

  computed: {
    formattedMax() {
      return utils.formatUnits(this.max || 0, 18);
    },

    usdEquivalent() {
      return filters.formatUSD(this.currentValue * (this.lpPrice / 1e18));
    },
  },

  watch: {
    currentValue(value, oldValue) {
      if (isNaN(value)) {
        this.currentValue = oldValue;
        return false;
      }
      this.$emit("updateValue", BigInt(Number(value) * 1e18));
    },

    max() {
      this.currentValue = null;
    },
  },

  methods: {
    formatTokenBalance(tokenAmount) {
      return filters.formatTokenBalance(tokenAmount);
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
}

.val-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 22px;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background: rgba(8, 14, 31, 0.6);
  width: 100%;
}

.val-input-error,
.val-input-error:focus-within {
  border-color: $clrErrorBorder;
}

.token-input-wrap,
.token-input-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  height: 100%;
  max-width: 50%;
}

.text-field {
  height: 32px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  background-color: transparent;
  border: none;
}

.text-field:focus {
  outline: none;
  border: none;
}

.usd-equivalent {
  color: #575c62;
  font-size: 14px;
  font-weight: 400;
}

.token-input-info {
  align-items: end;
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

.token-name {
  text-wrap: nowrap;
}

.wallet-balance {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 4px;
  color: #575c62;
  font-size: 14px;
  font-weight: 400;
}

.wallet-icon {
  cursor: pointer;
}

.value-error {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}
</style>
