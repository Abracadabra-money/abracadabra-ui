<template>
  <div class="deposit">
    <Default
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('updatePoolInfo')"
      v-if="isBalanced"
    />

    <Imbalanced
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('updatePoolInfo')"
      v-if="!isBalanced"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    pool: { type: Object },
    slippage: { type: BigInt, default: 100n },
    deadline: { type: BigInt, default: 100n },
    isBalanced: { type: Boolean },
  },

  emits: ["updatePoolInfo"],

  components: {
    Default: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/deposit/Default.vue")
    ),
    Imbalanced: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/deposit/Imbalanced.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  width: 100%;
}
</style>
