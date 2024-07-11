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
        allowSelectToken
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Base)"
        @updateInputValue="updateBaseTokenInputValue"
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
        :disabled="isAutoPricingEnabled"
        :value="quoteTokenValue"
        allowSelectToken
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Quote)"
        @updateInputValue="updateQuoteTokenInputValue"
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
    quoteTokenAmount: BigInt as Prop<bigint>,
    isAutoPricingEnabled: Boolean,
  },

  data() {
    return {
      TokenTypes,
      baseTokenValue: "",
      quoteTokenValue: "",
    };
  },

  watch: {
    quoteTokenAmount: {
      handler(value: bigint) {
        const { decimals } = this.quoteToken.config;
        console.log(value);

        if (!value) {
          this.quoteTokenValue = "";
          this.baseTokenValue = "";
        } else
          this.quoteTokenValue = trimZeroDecimals(formatUnits(value, decimals));
      },
      immediate: true,
    },
  },

  methods: {
    updateBaseTokenInputValue(value: bigint) {
      if (!value) this.baseTokenValue = "";
      else {
        const { decimals } = this.quoteToken.config;
        this.baseTokenValue = trimZeroDecimals(formatUnits(value, decimals));
      }

      this.$emit("updateTokenInputValue", TokenTypes.Base, value);
    },

    updateQuoteTokenInputValue(value: bigint) {
      this.$emit("updateTokenInputValue", TokenTypes.Quote, value);
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
