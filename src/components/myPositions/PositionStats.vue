<template>
  <div class="wrapper">
    <PositionStatsItem
      title="Liq. Price"
      :value="liquidationPrice"
      :liquidation-status="positionRisk"
      tooltip="Collateral Price at which your Position will be Liquidated"
    />
    <PositionStatsItem
      title="P/L"
      :value="profitLoss"
      :profit-status="profitStatus"
      tooltip="Profit and Loss"
    />
    <PositionStatsItem
      title="Entry Price"
      :value="entryPrice"
      tooltip="Entry Price"
    />
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import PositionStatsItem from "@/components/myPositions/PositionStatsItem.vue";

export default {
  props: {
    cauldron: {
      type: Object,
      required: true,
    },

    liquidationRisk: {
      type: [Number, String],
      required: true,
    },
  },

  computed: {
    liquidationPrice() {
      return filters.formatExactPrice(this.cauldron.liquidationPrice);
    },

    positionRisk() {
      if (this.liquidationRisk > 75) return "safe";
      if (this.liquidationRisk > 5 && this.liquidationRisk <= 75)
        return "medium";
      return "high";
    },

    profitLoss() {
      return filters.formatUSD(this.cauldron.positionStats.profit);
    },

    profitStatus() {
      return this.cauldron.positionStats.profit > 0 ? "up" : "loss";
    },

    entryPrice() {
      return filters.formatUSD(this.cauldron.positionStats.entryPrice);
    },
  },

  components: {
    PositionStatsItem,
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
