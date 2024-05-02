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

<script lang="ts">
import { defineAsyncComponent } from "vue";
import type { PropType } from "vue";
import type { PoolInfo } from "@/configs/pools/types";

export type PreviewPopupInfo = {
  lpAmount: bigint;
  baseTokenAmount: bigint;
  quoteTokenAmount: bigint;
};

export default {
  props: {
    pool: { type: Object as PropType<PoolInfo>, required: true },
    slippage: {
      type: BigInt as unknown as PropType<bigint>,
      required: true,
    },
    deadline: {
      type: BigInt as unknown as PropType<bigint>,
      required: true,
    },
    isBalanced: { type: Boolean },
  },

  emits: ["updatePoolInfo"],

  components: {
    Default: defineAsyncComponent(
      () => import("@/components/pools/pool/actions/deposit/Default.vue")
    ),
    Imbalanced: defineAsyncComponent(
      () => import("@/components/pools/pool/actions/deposit/Imbalanced.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  width: 100%;
}
</style>
