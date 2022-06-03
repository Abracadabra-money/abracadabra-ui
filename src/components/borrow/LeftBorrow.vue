<template>
  <div class="left-borrow">
    <span>MIMS LEFT TO BORROW:</span>
    <span>{{ borrowLeft | formatNumber }}</span>
  </div>
</template>

<script>
export default {
  props: {
    borrowLeft: {
      type: [String, Number],
      default: 0,
    },
  },

  filters: {
    formatNumber(value) {
      if (!value) return value;
      if (Number(value) === 0) return value;
      if (Number(value) < 1) return 0;

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.left-borrow {
  padding: 13px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

@media (max-width: 375px) {
  .left-borrow {
    font-size: 14px;
  }
}
</style>
