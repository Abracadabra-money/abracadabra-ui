<template>
  <div class="deposit">
    <Default
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('updatePoolInfo')"
      v-if="!isSingleSide"
    />

    <SingleSide
      :pool="pool"
      :slippage="slippage"
      :deadline="deadline"
      @updatePoolInfo="$emit('updatePoolInfo')"
      v-if="isSingleSide"
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
    isSingleSide: { type: Boolean },
  },

  emits: ["updatePoolInfo"],

  components: {
    Default: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/deposit/Default.vue")
    ),
    SingleSide: defineAsyncComponent(() =>
      import("@/components/pools/pool/actions/deposit/SingleSide.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  width: 100%;
}
</style>
