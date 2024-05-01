<template>
  <div class="inputs-wrap">
    <BaseTokenInput
      v-if="fromToken"
      :value="fromInputValue"
      :name="fromToken.config.name"
      :icon="fromToken.config.icon"
      :decimals="fromToken.config.decimals"
      :max="fromToken.userInfo.balance"
      :tokenPrice="fromTokenPrice"
      allowSelectToken
      @onSelectClick="$emit('openTokensPopup', 'from')"
      @updateInputValue="updateFromInputValue"
    />

    <button class="swap-button" @click="$emit('onToogleTokens')">
      <SwapIcon />
    </button>

    <BaseTokenInput
      v-if="toToken"
      :disabled="true"
      :value="toInputValue"
      :name="toToken.config.name"
      :icon="toToken.config.icon"
      :decimals="toToken.config.decimals"
      :max="toToken.userInfo.balance"
      :tokenPrice="toTokenPrice"
      :differencePrice="differencePrice"
      allowSelectToken
      @onSelectClick="$emit('openTokensPopup', 'to')"
    />
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { trimZeroDecimals } from "@/helpers/numbers";
import { defineAsyncComponent, type Prop } from "vue";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";

export default {
  props: {
    fromToken: Object as Prop<TokenInfo>,
    toToken: Object as Prop<TokenInfo>,
    toTokenAmount: BigInt as Prop<bigint>,
    fromTokenPrice: { type: Number, default: 0 },
    toTokenPrice: { type: Number, default: 0 },
    differencePrice: { type: Number, default: 0 },
  },

  data() {
    return {
      fromInputValue: "",
      toInputValue: "",
    };
  },

  watch: {
    toTokenAmount: {
      handler(value) {
        const { decimals } = this.toToken!.config;

        if (!value) {
          this.toInputValue = "";
          this.fromInputValue = "";
        } else
          this.toInputValue = trimZeroDecimals(formatUnits(value, decimals));
      },
      immediate: true,
    },
  },

  methods: {
    updateFromInputValue(value: bigint) {
      if (!value) this.fromInputValue = "";
      else {
        const { decimals } = this.fromToken!.config;
        this.fromInputValue = trimZeroDecimals(formatUnits(value, decimals));
      }

      this.$emit("updateFromInputValue", value);
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    SwapIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/SwapIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.inputs-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.swap-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(68px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2px;
}
</style>
