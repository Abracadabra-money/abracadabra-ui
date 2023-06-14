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
          <span class="pool-deprecated" v-if="pool.isDepreciated"
            >Deprecated</span
          >
        </div>
      </div>

      <div v-for="(item, i) in stats" :key="i">
        <span class="mobile-title">{{ item.title }}</span>
        <span>{{ item.value }}</span>
      </div>
      <div class="links-wrap">
        <div class="link-wrap" v-if="!pool.isDepreciated">
          <router-link :to="goToPage">Join farm</router-link>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

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
          title: "APR",
          value: filters.formatPercent(this.pool.poolRoi),
        },
        { title: "TVL", value: filters.formatUSD(this.pool.poolTvl) },
      ];
    },

    getChainIcon() {
      if (this.chainId === 56) {
        return this.$image("assets/images/networks/BNB.svg");
      }

      if (this.chainId === 250) {
        return this.$image("assets/images/networks/fantom-icon.svg");
      }

      if (this.chainId === 43114) {
        return this.$image("assets/images/networks/avalanche-icon.png");
      }

      if (this.chainId === 137) {
        return this.$image("assets/images/networks/polygon-icon.svg");
      }

      if (this.chainId === 42161) {
        return this.$image("assets/images/networks/Arbitrum.svg");
      }

      if (this.chainId === 10) {
        return this.$image("assets/images/networks/optimism-icon.svg");
      }

      return this.$image("assets/images/networks/ethereum-icon.svg");
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

.links-wrap {
  display: flex;
  justify-content: flex-end;
}

.link-wrap {
  text-decoration: none;
  max-width: 120px;
  width: 100%;
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

@media (min-width: 1024px) {
  .markets-link {
    padding: 0 20px;
    font-size: 16px;
    border-radius: 30px;
    min-height: 70px;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .stats-wrap {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
  .link-wrap {
    max-width: 100%;
  }
}
</style>
