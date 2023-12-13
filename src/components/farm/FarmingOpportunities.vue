<template>
  <div class="farming-opportunities">
    <h4 class="subtitle">Farming Opportunities</h4>

    <div class="select-glp">
      <SelectFarm
        :selectedFarm="selectedFarm"
        @openFarmsPopup="$emit('openFarmsPopup')"
      />
      <GetLpLink :link="selectedFarm.stakingToken.link" v-if="selectedFarm" />
    </div>

    <div class="farm-info">
      <div class="info-tag">
        <span class="title">
          APR
          <Tooltip
            :tooltip="'Annual Return on Staked tokens at current price'"
          />
        </span>
        <span class="value">{{ apr }}</span>
      </div>

      <div class="divider"></div>

      <div class="info-tag">
        <span class="title">
          TVL
          <Tooltip :tooltip="'Total Value Locked in Farm'" />
        </span>
        <span class="value">{{ tvl }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SelectFarm from "@/components/farm/SelectFarm.vue";
import GetLpLink from "@/components/ui/GetLpLink.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import filters from "@/filters/index";

export default {
  props: {
    selectedFarm: { type: Object },
  },

  computed: {
    apr() {
      return filters.formatPercent(this.selectedFarm?.farmRoi || 0);
    },

    tvl() {
      return filters.formatUSD(this.selectedFarm?.farmTvl || 0);
    },
  },

  components: {
    SelectFarm,
    GetLpLink,
    Tooltip,
  },
};
</script>

<style lang="scss" scoped>
.farming-opportunities {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  padding: 24px;
  min-width: 100%;
}

.subtitle {
  align-self: flex-start;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
  margin-bottom: 14px;
}

.select-glp {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 48px;
}

.farm-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 20px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
}

.info-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  width: 50%;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.divider {
  width: 1px;
  height: 29px;
  background: rgba(255, 255, 255, 0.72);
  margin: 0 13px;
}
</style>
