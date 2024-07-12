<template>
  <div class="pool-tokens-selector">
    <h4 class="action-title">Select tokens</h4>

    <div class="inputs-wrap">
      <BaseTokenInput
        :name="baseToken.config.name"
        :icon="baseToken.config.icon"
        :decimals="baseToken.config.decimals"
        :max="baseToken.userInfo.balance"
        :tokenPrice="baseToken.price"
        :value="baseTokenValue"
        allowSelectToken
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Base)"
        @updateInputValue="updateBaseTokenInputAmount"
      />

      <IconButton
        class="plus-icon"
        plus
        active
        disable
        :width="44"
        :height="44"
        borderRadius="16px"
      />

      <BaseTokenInput
        :name="quoteToken.config.name"
        :icon="quoteToken.config.icon"
        :decimals="quoteToken.config.decimals"
        :max="quoteToken.userInfo.balance"
        :tokenPrice="quoteToken.price"
        :value="quoteTokenValue"
        disabled
        allowSelectToken
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Quote)"
        @updateInputValue="updateQuoteTokenInputAmount"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop, type PropType } from "vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import { TokenTypes } from "@/views/pool/PoolCreation.vue";
import { trimZeroDecimals } from "@/helpers/numbers";
import { formatUnits } from "viem";

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
    baseTokenAmount: BigInt as Prop<bigint>,
    quoteTokenAmount: BigInt as Prop<bigint>,
  },

  data() {
    return {
      TokenTypes,
    };
  },

  computed: {
    baseTokenValue() {
      if (!this.baseTokenAmount) return "";

      const { decimals } = this.baseToken.config;
      return trimZeroDecimals(formatUnits(this.baseTokenAmount, decimals));
    },

    quoteTokenValue() {
      if (!this.quoteTokenAmount) return "";

      const { decimals } = this.quoteToken.config;
      return trimZeroDecimals(formatUnits(this.quoteTokenAmount, decimals));
    },
  },

  methods: {
    updateBaseTokenInputAmount(amount: bigint) {
      this.$emit("updateTokenInputAmount", TokenTypes.Base, amount || 0n);
    },

    updateQuoteTokenInputAmount(amount: bigint) {
      // this.$emit("updateTokenInputAmount", TokenTypes.Quote, amount || 0n);
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-tokens-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inputs-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.plus-icon {
  position: absolute;
  top: calc(50% - 28px);
  left: calc(50% - 28px);
  width: 46px;
  height: 46px;
}
</style>
