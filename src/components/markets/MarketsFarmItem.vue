<template>
  <router-link
    :to="{
      name: 'FarmPool',
      params: { id: pool.id },
    }"
    class="stats-item"
    :class="{ strategy: activePool ? activePool.strategyLink : false }"
  >
    <span class="status-wrap"
      ><StatusBar v-if="activePool" :isFarm="true" :pool="activePool"
    /></span>
    <span class="stats-item-wrap">
      <span class="network-data" :class="{ 'network-data-new': false }">
        <BaseTokenIcon :name="pool.name" :icon="pool.icon" />
        <span class="network-name-wrap">
          <span>{{ pool.name }}</span>
          <!--<span class="network-new">New</span>-->
        </span>
      </span>

      <span v-for="(item, i) in items" :key="i">
        <span class="column-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </span>
      <span class="degenbox">
        <!--<img
          class="degenbox-img"
          src="@/assets/images/degenbox.svg"
          alt="DegenBox"
        />-->
      </span>
    </span>
  </router-link>
</template>

<script>
import Vue from "vue";
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");

export default {
  name: "MarketsFarmItem",

  props: {
    pool: {
      type: Object,
    },
  },
  computed: {
    items() {
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

    activePool() {
      if (this.pool) {
        return this.$store.getters.getFarmPoolById(+this.pool.id) || null;
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
    padding: 0 20px;
    font-size: 16px;
    border-radius: 30px;
    height: 100px;

    grid-template-columns: 1fr 1fr 1fr 1fr 60px;
  }

  .stats-item-wrap {
    grid-template-columns: 1fr 1fr 1fr 1fr 60px;
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
