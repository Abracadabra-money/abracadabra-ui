<template>
  <div class="wrapper">
    <PositionLiquidationPrice :price="liquidationPrice" :risk="positionRisk" />
    <PositionProfitLoss :profit="profit" />
    <PositionPrice :entryPrice="entryPrice" />
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import PositionLiquidationPrice from "@/components/myPositions/PositionLiquidationPrice.vue";
import PositionProfitLoss from "@/components/myPositions/PositionProfitLoss.vue";
import PositionPrice from "@/components/myPositions/PositionPrice.vue";

export default {
  props: {
    cauldron: {
      type: Object,
      required: true,
    },

    liquidationRisk: {
      type: String,
      required: true,
    },
  },

  computed: {
    liquidationPrice() {
      return filters.formatExactPrice(this.cauldron.userInfo.liquidationPrice);
    },

    profit() {
      return this.cauldron.userInfo.positionStats.profit;
    },

    positionRisk() {
      if (this.liquidationRisk > 75) return "safe";
      if (this.liquidationRisk > 5 && this.liquidationRisk <= 75)
        return "medium";
      return "high";
    },

    entryPrice() {
      return this.cauldron.userInfo.positionStats.entryPric;
    },
  },

  components: {
    PositionLiquidationPrice,
    PositionProfitLoss,
    PositionPrice,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

@media screen and (max-width: 768px) {
  .wrapper {
    flex-direction: column;
  }
}
</style>
