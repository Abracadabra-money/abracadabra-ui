<template>
  <router-link
    :to="{
      name: 'BorrowId',
      params: { id: pool.id },
    }"
    class="stats-item"
    :class="{
      strategy: activePool ? activePool.cauldronSettings.strategyLink : false,
    }"
  >
    <span class="status-wrap"
      ><StatusBar v-if="activePool" :pool="activePool"
    /></span>
    <span class="stats-item-wrap">
      <img class="chain-icon" :src="getChainIcon" alt="" />
      <span class="network-data" :class="{ 'network-data-new': false }">
        <BaseTokenIcon :name="pool.name" :icon="pool.icon" />
        <span class="network-name-wrap">
          <span>{{ pool.name }}</span>
          <MiniStatusTag v-if="isMigrated" />
          <MiniStatusTag v-if="isLeverageTag" text="Leverage" />
        </span>
      </span>
      <span v-for="(item, i) in items" :key="i">
        <span class="column-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </span>
      <div class="links-wrap">
        <div class="link-wrap">
          <router-link :to="{ name: 'BorrowId', params: { id: pool.id } }">
            Borrow
          </router-link>
        </div>
        <div class="link-wrap">
          <router-link :to="{ name: 'LeverageId', params: { id: pool.id } }">
            Leverage
          </router-link>
        </div>
      </div>
      <span class="degenbox"> </span>
    </span>
  </router-link>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");
const MiniStatusTag = () => import("@/components/ui/MiniStatusTag");

export default {
  name: "MarketsBorrowItem",

  props: {
    pool: {
      type: Object,
    },
  },
  methods: {
    formatNumber(value) {
      if (isNaN(Number(value)) || Number(value) < 1) return 0;

      const lookup = [
        { value: 0, symbol: "" },
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return parseFloat(value) >= item.value;
        });
      return (
        (parseFloat(value) / item.value).toFixed(2).replace(rx, "$1") +
        item.symbol
      );
    },
  },
  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    items() {
      return [
        {
          title: "TOTAL MIM BORROWED",
          value: this.formatNumber(
            Vue.filter("formatTokenBalance")(this.pool.totalBorrow)
          ),
        },
        {
          title: "TVL",
          value: `$ ${this.formatNumber(
            Vue.filter("formatTokenBalance")(this.pool.tvl)
          )}`,
        },
        {
          title: "MIMS LEFT TO BORROW",
          value: this.formatNumber(
            Vue.filter("formatTokenBalance")(this.pool.dynamicBorrowAmount)
          ),
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
  },

  components: {
    BaseTokenIcon,
    StatusBar,
    MiniStatusTag,
  },
};
</script>

<style lang="scss" scoped>
.stats-item {
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

.stats-item-wrap {
  display: grid;
  grid-gap: 4px;
  width: 100%;
}

.network-data {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 6px;
  .network-name-wrap {
    position: relative;
    // display: flex;
    // align-items: center;
    // height: 32px;

    .network-new {
      position: absolute;
      display: flex;
      align-items: center;
      top: 100%;
      background-color: #6372f8;
      padding: 0 10px;
      border-radius: 32px;
      font-size: 12px;
      line-height: 16px;
    }
  }
}

.network-data-new {
  margin-bottom: 21px;
}

.column-title {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.degenbox {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;

  .degenbox-img {
    width: 32px;
  }
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
.chain-icon {
  max-width: 26px;
  width: 100%;
  max-height: 26px;
}

@media (min-width: 1024px) {
  .stats-item {
    padding: 0 20px;
    font-size: 16px;
    border-radius: 30px;
    height: 100px;
  }

  .stats-item-wrap {
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 180px;
    align-items: center;
    grid-gap: 0;
    height: 36px;
  }

  .network-data {
    margin-bottom: 0;
    .network-name-wrap {
      height: 28px;
    }
  }
  .column-title {
    display: none;
  }

  .degenbox {
    position: static;
    .degenbox-img {
      width: 40px;
    }
  }

  .status-wrap {
    top: 8px;
  }
}
</style>
