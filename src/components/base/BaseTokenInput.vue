<template>
  <div class="wrap">
    <div class="val-input">
      <div class="token-input-wrap">
        <input
          name="tokenInput"
          class="text-field"
          v-model="inputValue"
          type="text"
          placeholder="0.0"
          :disabled="disabled"
        />
        <p class="usd-equivalent" v-if="tokenPrice">{{ usdEquivalent }}</p>
      </div>

      <div class="token-input-info">
        <div class="token-info" v-tooltip="tooltip">
          <BaseTokenIcon :icon="icon" :name="name" size="28px" />
          <span class="token-name" ref="tokenName">
            {{ tokenName }}
          </span>
        </div>

        <p
          :class="['wallet-balance', { 'primary-max': primaryMax }]"
          v-if="!disabled"
          @click="inputValue = formattedMax"
        >
          <span v-if="primaryMax">MAX:</span>
          <WalletIcon v-else :width="13" :height="13" fill="#575C62" />
          {{ formatTokenBalance(formattedMax) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import filters from "@/filters/index";
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { formatUnits, parseUnits } from "viem";

export default {
  props: {
    decimals: { type: Number, default: 18 },
    isBigNumber: { type: Boolean, default: false },
    max: {},
    value: {}, // TODO: use bignumber (bigint) & parse in data.inputValue
    icon: {
      type: String,
    },
    name: {
      type: String,
      default: "Select Farm",
    },
    tokenPrice: {},
    disabled: { type: Boolean, default: false },
    primaryMax: {
      type: Boolean,
      default: false,
    },
  },

  data(): any {
    return {
      inputValue: this.value,
      // tokenName: this.name,
      tooltip: "",
    };
  },

  computed: {
    tokenName() {
      let tokenName = this.name;
      if (tokenName.length > 11) {
        tokenName = tokenName.slice(0, 10) + "...";
      }
      return tokenName;
    },

    formattedMax() {
      if (this.isBigNumber)
        return utils.formatUnits(this.max || 0, this.decimals);
      return formatUnits(this.max || 0, this.decimals);
    },

    usdEquivalent(): any {
      return filters.formatUSD(this.inputValue * this.tokenPrice);
    },
  },

  watch: {
    inputValue(value, oldValue) {
      if (!value) {
        this.$emit("updateInputValue", null);
        return;
      }

      if (isNaN(value)) {
        this.inputValue = oldValue;
        return false;
      }

      if (this.isBigNumber) {
        const emitValue = !value
          ? BigNumber.from(0)
          : utils.parseUnits(
              filters.formatToFixed(value, this.decimals),
              this.decimals
            );

        this.$emit("updateInputValue", emitValue);
      } else {
        const emitValue = !value
          ? BigInt(0)
          : parseUnits(
              filters.formatToFixed(value, this.decimals),
              this.decimals
            );

        this.$emit("updateInputValue", emitValue);
      }
    },

    value(value) {
      this.inputValue = value;
    },
  },

  methods: {
    formatTokenBalance(tokenAmount: number) {
      return filters.formatTokenBalance(tokenAmount);
    },
  },

  mounted() {
    if (this.name.length > 11) {
      this.tooltip = this.name;
    }
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    WalletIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/WalletIcon.vue")
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
  max-width: 95%;
  width: 100%;
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
  cursor: pointer;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 4px;
  color: #575c62;
  font-size: 14px;
  font-weight: 400;
}

.primary-max {
  background: var(
    --Primary-Gradient,
    linear-gradient(90deg, #2d4a96 0%, #745cd2 100%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wallet-icon {
  cursor: pointer;
}
</style>
