<template>
  <router-link :to="goToPage" class="markets-link">
    <div class="stats-wrap">
      <div>
        <p class="chain-title">Chain</p>
        <img class="chain-icon" :src="getChainIcon" alt="" />
      </div>
      <div class="pool-info">
        <BaseTokenIcon :name="pool.name" :icon="pool.icon" />
        <div class="pool-description">
          <span>{{ pool.name }}</span>
          <span class="pool-new" v-if="isPoolNew">New</span>
        </div>
      </div>
      <div v-for="(item, i) in items" :key="i">
        <span class="mobile-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </div>
      <div class="links-wrap" v-if="isDepreciated">
        <div class="link-wrap">
          <router-link :to="goToBorrowPage"> Borrow </router-link>
        </div>
        <div class="link-wrap" v-if="isLeverage">
          <router-link :to="goToLeveragePage"> Leverage </router-link>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");

export default {
  props: {
    pool: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    goToPage() {
      if (this.pool?.cauldronSettings?.isDepreciated) {
        return {
          name: "RepayId",
          params: { id: this.pool.id },
        };
      }

      return {
        name: "BorrowId",
        params: { id: this.pool.id },
      };
    },

    items() {
      return [
        {
          title: "TOTAL MIM BORROWED",
          value: Vue.filter("formatLargeSum")(this.pool.totalBorrow),
        },
        {
          title: "TVL",
          value: `$ ${Vue.filter("formatLargeSum")(this.pool.tvl)}`,
        },
        {
          title: "MIMS LEFT TO BORROW",
          value: Vue.filter("formatLargeSum")(this.pool.dynamicBorrowAmount),
        },
        { title: "INTEREST", value: `${this.pool.interest}%` },
      ];
    },

    getChainIcon() {
      if (this.chainId === 56) {
        return require("@/assets/images/networks/binance-icon.svg");
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
        return require("@/assets/images/networks/arbitrum-icon.svg");
      }

      if (this.chainId === 10) {
        return require("@/assets/images/networks/optimism-icon.svg");
      }

      return require("@/assets/images/networks/ethereum-icon.svg");
    },

    isDepreciated() {
      if (this.pool?.cauldronSettings)
        return !this.pool.cauldronSettings.isDepreciated;
      return !this.pool.isDepreciated;
    },

    isLeverage() {
      return this.pool.isSwappersActive && !!this.pool.levSwapperContract;
    },

    goToBorrowPage() {
      return { name: "BorrowId", params: { id: this.pool.id } };
    },

    goToLeveragePage() {
      return { name: "LeverageId", params: { id: this.pool.id } };
    },

    isPoolNew() {
      return this.pool.cauldronSettings.isNew;
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
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
  text-transform: uppercase;
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

.pool-description {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.pool-new {
  width: 45px;
  background: #6372f8;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 10px;
}

.mobile-title {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.links-wrap {
  display: flex;
  gap: 10px;
}

.link-wrap {
  text-decoration: none;
  width: 84px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  align-items: center;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: #fff;
  }
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  text-decoration: none;
  pointer-events: none;
}

@media (min-width: 1024px) {
  .markets-link {
    padding: 0 20px;
    font-size: 16px;
    border-radius: 30px;
    height: 70px;
  }

  .stats-wrap {
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 180px;
    align-items: center;
    grid-gap: 0;
    height: 36px;
  }

  .mobile-title {
    display: none;
  }

  .chain-title {
    display: none;
  }

  .pool-info {
    margin-bottom: 0;
  }

  .pool-description {
    height: 28px;
  }
}
</style>
