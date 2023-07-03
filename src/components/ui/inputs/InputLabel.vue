<template>
  <div class="wrapper">
    <p class="title">{{ title }}</p>
    <div class="amount">Balance: {{ formatTokenBalance(amount) }}</div>
  </div>
</template>
<script>
import filters from "@/filters/index.js";

export default {
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
    formatTokenBalance(amount) {
      return filters.formatTokenBalance(amount);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 150%;
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
