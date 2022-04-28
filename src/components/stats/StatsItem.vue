<template>
  <button class="stats-item" :class="{ 'stats-item-farm': isFarm }">
    <span class="network-data" :class="{ 'network-data-new': isNew }">
      <TokenIcon :token="poolData.name" bgColor="transparent" />
      <span class="network-name-wrap">
        <span>{{ poolData.name }}</span>
        <span v-if="isNew" class="network-new">New</span>
      </span>
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
  </button>
</template>

<script>
const TokenIcon = () => import("@/components/ui/TokenIcon");

export default {
  name: "StatsItem",
  components: { TokenIcon },
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
  computed: {
    items() {
      return this.isFarm
        ? [
            { title: "~Yield per $1000", value: this.poolData.yield },
            { title: "ROI Annually", value: this.poolData.roi },
            { title: "TVL", value: this.poolData.tvl },
          ]
        : [
            { title: "TOTAL MIM BORROWED", value: this.poolData.totalMim },
            { title: "MIMS LEFT TO BORROW", value: this.poolData.mimsLeft },
            { title: "INTEREST", value: this.poolData.interest },
            { title: "LIQUIDATION FEE", value: this.poolData.liquidation },
          ];
    },
  },
};
</script>

<style lang="scss" scoped>
.stats-item {
  position: relative;
  display: grid;
  background-color: #2a2835;
  line-height: 21px;
  border-radius: 26px;
  padding: 10px;
  height: auto;
  grid-gap: 4px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  color: white;
  text-align: left;
  box-shadow: 0 0 0 1px transparent;

  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 0 1px #8180ff;
  }
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
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 60px;
    align-items: center;
    padding: 0 20px;
    grid-gap: 0;
    height: 100px;
    font-size: 16px;
    border-radius: 30px;
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
}
</style>
