<template>
  <div class="wrapper">
    <h4>{{ title }}</h4>
    <div class="amount">Balance: {{ formatTokenBalance(amount) }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { formatTokenBalance } from "@/filters/indexViem";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "Collateral assets",
    },
    amount: {
      type: [Number, String],
      default: "0.0",
    },
  },

  methods: {
    formatTokenBalance,
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.amount {
  font-size: 14px;
}

@media (max-width: 600px) {
  .amount {
    flex: 1;
    text-align: right;
  }
}
</style>
