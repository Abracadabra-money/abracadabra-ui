<template>
  <router-link
    :to="{
      name: isFarm ? 'FarmPool' : 'BorrowId',
      params: { id: poolData.id },
    }"
    class="stats-item"
    :class="{ 'stats-item-farm': isFarm, strategy: activePool.strategyLink }"
  >
    <span class="status-wrap"
      ><StatusBar :isFarm="isFarm" :pool="activePool"
    /></span>
    <span class="stats-item-wrap" :class="{ 'stats-item-wrap-farm': isFarm }">
      <span class="network-data" :class="{ 'network-data-new': isNew }">
        <BaseTokenIcon :name="poolData.name" :icon="poolData.icon" />
        <span class="network-name-wrap">
          <span>{{ poolData.name }}</span>
          <span v-if="isNew" class="network-new">New</span>
        </span>
        <span class="mobile-status-wrap"
          ><StatusBar :isFarm="isFarm" :pool="activePool"
        /></span>
      </span>

      <span v-for="(item, i) in items" :key="i">
        <span class="column-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </span>
      <span class="degenbox">
        <img
          v-if="degen"
          class="degenbox-img"
          src="@/assets/images/degenbox.svg"
          alt="DegenBox"
        />
      </span>
    </span>
  </router-link>
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");

export default {
  name: "StatsItem",

  props: {
    poolData: {
      type: Object,
    },
    degen: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isFarm: {
      type: Boolean,
      default: false,
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
    items() {
      return this.isFarm
        ? [
            { title: "~Yield per $1000", value: this.poolData.yield },
            { title: "ROI Annually", value: this.poolData.roi },
            { title: "TVL", value: this.poolData.tvl },
          ]
        : [
            {
              title: "TOTAL MIM BORROWED",
              value: this.formatNumber(this.poolData.totalMim),
            },
            {
              title: "MIMS LEFT TO BORROW",
              value: this.formatNumber(this.poolData.mimsLeft),
            },
            { title: "INTEREST", value: `${this.poolData.interest}%` },
            {
              title: "LIQUIDATION FEE",
              value: `${this.poolData.liquidation}%`,
            },
          ];
    },

    activePool() {
      if (this.poolData) {
        let pool = this.isFarm
          ? this.$store.getters.getFarmPoolById(+this.poolData.id)
          : this.$store.getters.getPoolById(+this.poolData.id);

        if (pool) return pool;
        return null;
      }
      return null;
    },
  },

  components: {
    BaseTokenIcon,
    StatusBar,
  },
};
</script>

<style lang="scss" scoped>
.stats-item {
  position: relative;

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
  height: 18px;
  margin-bottom: 6px;
  display: none;
}

.mobile-status-wrap {
  flex: 1 1 max-content;
}

.stats-item-wrap {
  display: grid;
  grid-gap: 4px;
}

.network-data {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 6px;
  .network-name-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;

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

@media (min-width: 1024px) {
  .stats-item {
    padding: 8px 20px 0;
    font-size: 16px;
    border-radius: 30px;
    height: 100px;
    &-farm {
      grid-template-columns: 1fr 1fr 1fr 1fr 60px;
    }
  }

  .stats-item-wrap {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 60px;
    align-items: center;
    grid-gap: 0;
    height: 36px;

    &-farm {
      grid-template-columns: 1fr 1fr 1fr 1fr 60px;
    }
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
    display: block;
  }
}
</style>
