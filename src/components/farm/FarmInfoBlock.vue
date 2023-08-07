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

  <div class="farm-link-wrap">
    <a class="farm-link" :href="selectedFarm.stakingTokenLink" target="_blank">
      <img src="@/assets/images/farm-lp.svg" alt="" />
      <p>Get LP’s</p>
      <img src="@/assets/images/farm-lp-arrow.svg" alt="" />
    </a>
  </div>
</template>
<script>
import filters from "@/filters/index.js";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

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

  components: { Tooltip },
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

.farm-link-wrap {
  display: flex;
  justify-content: center;
}

.farm-link {
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-column-gap: 7px;
  justify-content: center;
  align-items: center;
  padding: 3px 10px;
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  border-radius: 30px;
  font-size: 14px;
  color: #63caf8;
}

@media (max-width: 600px) {
  .info-item {
    margin: 0 0 35px 0;
  }
}
</style>
