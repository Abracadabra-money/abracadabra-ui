<template>
  <div class="pool-tokens-selector">
    <h4 class="action-title">Select tokens</h4>

    <div class="inputs-wrap">
      <BaseTokenInput
        :name="baseToken.config.name"
        :icon="baseToken.config.icon"
        :decimals="baseToken.config.decimals"
        :max="baseToken.userInfo.balance"
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
        allowSelectToken
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Quote)"
        @updateInputValue="updateQuoteTokenInputValue"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import { TokenTypes } from "@/views/pool/PoolCreation.vue";

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
    return { TokenTypes };
  },

  methods: {
    updateBaseTokenInputValue(value: bigint) {
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
