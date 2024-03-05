<template>
  <div class="inputs-wrap">
    <!-- 
          :error="amountError"
          @updateInputValue="updateMainValue"
          :disabled="isActionsDisabled"
        /> -->

    <BaseTokenInput
      :value="fromInputValue"
      :name="fromToken.name"
      :icon="fromToken.icon"
      :decimals="fromToken.decimals"
      :max="fromToken.balance"
      allowSelectToken
      @onSelectClick="$emit('openTokensPopup', 'from')"
    />
    <!-- @updateInputValue="updateFromValue" -->

    <button class="swap-button">
      <SwapIcon />
    </button>

    <!--
            :error="amountError"
            @updateInputValue="updateMainValue"
            :disabled="isActionsDisabled" -->
    <BaseTokenInput
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
import { defineAsyncComponent } from "vue";

export default {
  props: {
    fromToken: {} as any,
    toToken: {} as any,
  },

  data() {
    return {
      fromInputValue: "",
      toInputValue: "",
    };
  },

  methods: {},

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
