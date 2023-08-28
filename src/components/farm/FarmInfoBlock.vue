<template>
  <div class="info-item underline">
    <p class="info-item-text">
      <Tooltip :tooltip="'Annual Return on Staked tokens at current price'" />
      APR
    </p>
    <p class="info-item-value">{{ formatPercent(selectedFarm.farmRoi) }}</p>
  </div>

  <div class="info-item underline">
    <p class="info-item-text">
      <Tooltip :tooltip="'Total Value Locked in the Farm'" />
      TVL
    </p>
    <p class="info-item-value">{{ formatUSD(selectedFarm.farmTvl) }}</p>
  </div>

  <GetLpLink :link="selectedFarm.stakingToken.link" />
</template>
<script>
import filters from "@/filters/index.js";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import GetLpLink from "@/components/ui/GetLpLink.vue";

export default {
  props: {
    selectedFarm: { type: Object },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatPercent(value) {
      return filters.formatPercent(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
  },

  components: { Tooltip, GetLpLink },
};
</script>
<style lang="scss" scoped>
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 13px;
  margin: 0 -30px 35px -30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item-text {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
}
.info-item-text img {
  margin-right: 10px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .info-item {
    margin: 0 -15px 35px -15px;
  }
}

@media (max-width: 600px) {
  .info-item {
    margin: 0 0 35px 0;
  }
}
</style>
