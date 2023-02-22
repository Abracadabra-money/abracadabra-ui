<template>
  <router-link
    :to="goToPage"
    class="markets-link"
    :class="{ strategy: isStrategyLink }"
  >
    <div class="status-wrap">
      <StatusBar v-if="activePool" :pool="activePool" />
    </div>

    <div class="stats-wrap">
      <div>
        <p class="chain-title">Chain</p>
        <img class="chain-icon" :src="getChainIcon" alt="" />
      </div>
      <div class="pool-info">
        <BaseTokenIcon :name="pool.name" :icon="pool.icon" />
        <div class="pool-description">
          <span>{{ pool.name }}</span>
          <MiniStatusTag v-if="isMigrated" />
          <MiniStatusTag v-if="isLeverageTag" text="Leverage" />
        </div>
      </div>
      <div v-for="(item, i) in items" :key="i">
        <span class="mobile-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </div>
      <div class="links-wrap">
        <div class="link-wrap">
          <router-link
            :to="goToBorrowPage"
            :class="{ disabled: !isDepreciated }"
          >
            Borrow
          </router-link>
        </div>
        <div class="link-wrap">
          <router-link
            :to="goToLeveragePage"
            :class="{ disabled: !isDepreciated }"
          >
            Leverage
          </router-link>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");
const MiniStatusTag = () => import("@/components/ui/MiniStatusTag");

export default {
  props: {
    pool: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    goToPage() {
      return {
        name: "BorrowId",
        params: { id: this.pool.id },
      };
    },

    isStrategyLink() {
      return this.activePool
        ? this.activePool?.cauldronSettings?.strategyLink
        : false;
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

    activePool() {
      if (this.pool) {
        return this.$store.getters.getPoolById(+this.pool.id) || null;
      }
      return null;
    },

    isMigrated() {
      if (this.activePool?.cauldronSettings)
        return this.activePool.cauldronSettings.isMigrated;

      return this.activePool?.isMigrated;
    },

    isLeverageTag() {
      return (
        (this.chainId === 42161 && this.activePool?.id === 3) ||
        (this.chainId === 1 && this.activePool?.id === 39)
      );
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

    goToBorrowPage() {
      return { name: "BorrowId", params: { id: this.pool.id } };
    },

    goToLeveragePage() {
      return { name: "LeverageId", params: { id: this.pool.id } };
    },
  },

  components: {
    BaseTokenIcon,
    StatusBar,
    MiniStatusTag,
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

  &.strategy {
    box-shadow: 0 0 0 1px #8180ff;
  }

  &:hover {
    background: #343141;
  }
}

.status-wrap {
  position: absolute;
  right: 12px;
  top: 13px;
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
    height: 100px;
  }

  .stats-wrap {
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 180px;
    align-items: center;
    grid-gap: 0;
    height: 36px;
  }

  .status-wrap {
    top: 8px;
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
