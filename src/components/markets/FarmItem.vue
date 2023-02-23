<template>
  <router-link :to="goToPage" class="markets-link">
    <div class="stats-wrap">
      <div>
        <p class="chain-title">CHAIN</p>
        <img class="chain-icon" :src="getChainIcon" alt="Chain icon" />
      </div>

      <div class="pool-info">
        <BaseTokenIcon :name="pool.name" :icon="pool.icon" />
        <div>
          <span class="pool-name">
            {{ pool.name }}
          </span>
          <span class="pool-deprecated" v-if="pool.isDepreciated">Deprecated</span>
        </div>
      </div>

      <div v-for="(item, i) in stats" :key="i">
        <span class="mobile-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import Vue from "vue";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");

export default {
  props: {
    pool: {
      type: Object,
    },
  },

  computed: {
    goToPage() {
      return { name: "FarmPool", params: { id: this.pool.id } };
    },

    stats() {
      return [
        {
          title: "~Yield per $1000",
          value: Vue.filter("formatTokenBalance")(this.pool.poolYield),
        },
        {
          title: "ROI Annually",
          value: Vue.filter("formatPercent")(this.pool.poolRoi),
        },
        { title: "TVL", value: Vue.filter("formatUSD")(this.pool.poolTvl) },
      ];
    },

    getChainIcon() {
      if (this.chainId === 56) {
        return require("@/assets/images/networks/BNB.svg");
      }

      if (this.chainId === 250) {
        return require("@/assets/images/networks/fantom-icon.svg");
      }

      if (this.chainId === 43114) {
        return require("@/assets/images/networks/avalanche-icon.png");
      }

      if (this.chainId === 137) {
        return require("@/assets/images/networks/polygon-icon.svg");
      }

      if (this.chainId === 42161) {
        return require("@/assets/images/networks/Arbitrum.svg");
      }

      if (this.chainId === 10) {
        return require("@/assets/images/networks/optimism-icon.svg");
      }

      return require("@/assets/images/networks/ethereum-icon.svg");
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.pool-deprecated {
  width: max-content;
  background: #d94844;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 10px;
}

.markets-link {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #2a2835;
  line-height: 21px;
  border-radius: 26px;
  padding: 10px;
  height: auto;
  font-size: 14px;
  border: none;
  cursor: pointer;
  color: white;
  text-align: left;
  box-shadow: 0 0 0 1px transparent;
  transition: all 0.2s;

  &:hover {
    background: #343141;
  }
}

.stats-wrap {
  display: grid;
  grid-gap: 4px;
  width: 100%;
}

.chain-title {
  display: block;
}

.chain-icon {
  max-width: 26px;
  width: 100%;
  max-height: 26px;
}

.pool-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 6px;
}
.pool-name {
  display: flex;
  align-items: center;
  height: 32px;
}

.mobile-title {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .markets-link {
    padding: 0 20px;
    font-size: 16px;
    border-radius: 30px;
    min-height: 70px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .stats-wrap {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 0;
  }

  .chain-title {
    display: none;
  }

  .pool-info {
    margin-bottom: 0;
  }
  .mobile-title {
    display: none;
  }

  .pool-name {
    height: 28px;
  }
}
</style>
