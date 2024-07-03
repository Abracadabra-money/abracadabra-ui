<template>
  <div class="pool-tokens-selector">
    <h4 class="action-title">Select tokens</h4>

    <div class="inputs-wrap">
      <BaseTokenInput allowSelectToken />

      <IconButton
        class="plus-icon"
        plus
        active
        disable
        :width="44"
        :height="44"
        borderRadius="16px"
      />

      <BaseTokenInput allowSelectToken />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
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
