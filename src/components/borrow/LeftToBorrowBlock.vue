<template>
  <div class="left-borrow">
    <span>MIMS LEFT TO BORROW:</span>
    <span>{{ formatLargeSum }}</span>
  </div>
</template>

<script>
import { utils, BigNumber } from "ethers";
import filters from "@/filters/index.js";

export default {
  props: {
    borrowLeft: {
      type: BigNumber,
      default: 0,
    },
  },
  computed: {
    formatLargeSum() {
      return filters.formatLargeSum(utils.formatUnits(this.borrowLeft));
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
  line-height: 24px;
}

@media (max-width: 375px) {
  .left-borrow {
    font-size: 14px;
  }
}
</style>
