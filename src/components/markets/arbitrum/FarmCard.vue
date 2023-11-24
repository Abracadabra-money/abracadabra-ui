<template>
  <router-link :to="goToPage" class="farm-card">
    <div class="card-header">
      <div class="farm-icon-name">
        <BaseTokenIcon :name="farm.name" :icon="farm.icon" />
        <span class="farm-card-name">{{ farm.name }}</span>
      </div>
      <img class="chain-icon" src="@/assets/images/networks/arbitrum-chain.svg">
    </div>

    <div class="card-stats">
      <div class="boosted-yield">
        <p class="title">
          <Tooltip class="tooltip" />
          Boosted Yield
        </p>
        <p class="value">{{ boostedYield }}%</p>
      </div>

      <p class="tvl">
        <span class="title">tvl</span> <span class="value">{{ tvl }}</span>
      </p>
    </div>
  </router-link>
</template>
<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue"
import filters from "@/filters/index"

export default {
  props: {
    farm: {
      type: Object,
    },
  },

  computed: {
    tvl() { return filters.formatUSD(this.farm.farmTvl) },
    boostedYield() { return filters.formatToFixed(this.farm.farmYield, 2) },
    goToPage() {
      return { name: "Farm", params: { id: this.farm.id } };
    },
  },

  components: {
    BaseTokenIcon,
    Tooltip
  },
};
</script>
<style lang="scss" scoped>
.farm-card {
  height: 201px;
  width: 302px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: linear-gradient(146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%);
  backdrop-filter: blur(12.5px);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  color: white;
  transition: 0.3s;
}

.farm-card:hover {
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.21);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 16px 16px 0px 0px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
}

.farm-icon-name {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chain-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 6.5px;
}

.card-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100%;
  gap: 12px;
  padding: 18px 31px 0px 31px;
}

.boosted-yield .title {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 3px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.tooltip {
  width: 16px;
}

.boosted-yield .value {
  color: #67A069;
  text-align: center;
  font-size: 39px;
  font-weight: 600;
}

.tvl {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 11px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
