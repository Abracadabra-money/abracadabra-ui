<template>
  <div class="pool-tokens-selector">
    <h4 class="action-title">Select tokens</h4>

    <div class="inputs-wrap">
      <BaseTokenInputSkeleton v-show="isLoading" />
      <BaseTokenInput
        :name="baseToken.config.symbol"
        :icon="baseToken.config.icon"
        :decimals="baseToken.config.decimals"
        :max="baseToken.userInfo.balance"
        :tokenPrice="baseToken.price"
        :value="baseTokenValue"
        allowSelectToken
        :isGradientSelector="!checkIsTokenSelected(baseToken)"
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Base)"
        @updateInputValue="updateBaseTokenInputAmount"
        v-show="!isLoading"
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

      <BaseTokenInputSkeleton v-if="isLoading" />
      <BaseTokenInput
        :name="quoteToken.config.symbol"
        :icon="quoteToken.config.icon"
        :decimals="quoteToken.config.decimals"
        :max="quoteToken.userInfo.balance"
        :tokenPrice="quoteToken.price"
        :value="quoteTokenValue"
        allowSelectToken
        :isGradientSelector="!checkIsTokenSelected(quoteToken)"
        @onSelectClick="$emit('openTokensPopup', TokenTypes.Quote)"
        @updateInputValue="updateQuoteTokenInputAmount"
        v-show="!isLoading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type Prop, type PropType } from "vue";
import type { PoolCreationTokenInfo } from "@/configs/pools/poolCreation/types";
import { trimZeroDecimals } from "@/helpers/numbers";
import { formatUnits } from "viem";
import { TokenTypes } from "@/constants/pools/poolCreation";

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
    isLoading: Boolean,
  },

  data() {
    return {
      baseChangedProgrammatically: false,
      quoteChangedProgrammatically: false,
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

  watch: {
    baseTokenAmount() {
      this.baseChangedProgrammatically = true;
    },
    quoteTokenAmount() {
      this.quoteChangedProgrammatically = true;
    },
  },

  methods: {
    updateBaseTokenInputAmount(amount: bigint) {
      if (this.baseChangedProgrammatically) {
        this.baseChangedProgrammatically = false;
        this.quoteChangedProgrammatically = false;
        return;
      }
      this.$emit("updateTokenInputAmount", TokenTypes.Base, amount || 0n);
    },

    updateQuoteTokenInputAmount(amount: bigint) {
      if (this.quoteChangedProgrammatically) {
        this.baseChangedProgrammatically = false;
        this.quoteChangedProgrammatically = false;
        return;
      }
      this.$emit("updateTokenInputAmount", TokenTypes.Quote, amount || 0n);
    },

    checkIsTokenSelected(token: PoolCreationTokenInfo) {
      return token.config.name != "Select Token";
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    BaseTokenInputSkeleton: defineAsyncComponent(
      () => import("@/components/ui/skeletons/BaseTokenInputSkeleton.vue")
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
