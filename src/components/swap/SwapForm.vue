<template>
  <div class="inputs-wrap">
    <BaseTokenInput
      :value="fromInputValue"
      :name="fromToken.name"
      :icon="fromToken.icon"
      :decimals="fromToken.decimals"
      :max="fromToken.balance"
      allowSelectToken
      @onSelectClick="$emit('openTokensPopup', 'from')"
      @updateInputValue="$emit('updateFromInputValue', $event)"
    />

    <button class="swap-button" @click="$emit('onToogleTokens')">
      <SwapIcon />
    </button>

    <BaseTokenInput
      :disabled="true"
      :value="toInputValue"
      :name="toToken.name"
      :icon="toToken.icon"
      :decimals="toToken.decimals"
      :max="toToken.balance"
      allowSelectToken
      @onSelectClick="$emit('openTokensPopup', 'to')"
    />
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { trimZeroDecimals } from "@/helpers/numbers";
import { defineAsyncComponent, type PropType } from "vue";

export default {
  props: {
    fromToken: {} as any, //todo type
    toToken: {} as any, //todo type
    toTokenAmount: BigInt as unknown as PropType<bigint>,
  },

  data() {
    return {
      fromInputValue: "",
      toInputValue: "",
    };
  },

  watch: {
    toTokenAmount(value) {
      const { decimals } = this.toToken;

      if (!value) this.toInputValue = "";
      else this.toInputValue = trimZeroDecimals(formatUnits(value, decimals));
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
}
</style>
