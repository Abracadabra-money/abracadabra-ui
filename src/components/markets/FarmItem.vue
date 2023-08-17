<template>
  <router-link :to="goToPage" class="markets-link">
    <div class="stats-wrap">
      <div>
        <p class="chain-title">CHAIN</p>
        <img class="chain-icon" :src="getChainIcon" alt="Chain icon" />
      </div>

      <div class="farm-info">
        <BaseTokenIcon :name="farm.name" :icon="farm.icon" />
        <div>
          <span class="farm-name">
            {{ farm.name }}
          </span>
          <span class="farm-deprecated" v-if="farm.isDepreciated"
            >Deprecated</span
          >
        </div>
      </div>

      <div v-for="(item, i) in farmInfo" :key="i">
        <span class="item-title">{{ item.title }}</span>
        <span class="item-value">{{ item.value }}</span>
      </div>
      <div class="links-wrap">
        <div class="link-wrap" v-if="!farm.isDepreciated">
          <router-link :to="goToPage">Join farm</router-link>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    farm: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    goToPage() {
      return { name: "Farm", params: { id: this.farm.id } };
    },

    farmInfo() {
      return [
        {
          title: "APR",
          value: filters.formatPercent(this.farm.farmRoi),
        },
        { title: "TVL", value: filters.formatUSD(this.farm.farmTvl) },
      ];
    },

    getChainIcon() {
      if (this.chainId === 56) {
        return useImage("assets/images/networks/BNB.svg");
      }

      if (this.chainId === 250) {
        return useImage("assets/images/networks/fantom-icon.svg");
      }

      if (this.chainId === 43114) {
        return useImage("assets/images/networks/avalanche-icon.png");
      }

      if (this.chainId === 137) {
        return useImage("assets/images/networks/polygon-icon.svg");
      }

      if (this.chainId === 42161) {
        return useImage("assets/images/networks/Arbitrum.svg");
      }

      if (this.chainId === 10) {
        return useImage("assets/images/networks/optimism-icon.svg");
      }

      return useImage("assets/images/networks/ethereum-icon.svg");
    },
  },

  components: {
    BaseTokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.farm-deprecated {
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

.farm-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 6px;
}
.farm-name {
  display: flex;
  align-items: center;
  height: 32px;
}

.item-title {
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
    grid-template-columns: 0.5fr 1.1fr 1.1fr 1.1fr 1.2fr;
    align-items: center;
    grid-gap: 0;
  }

  .chain-title {
    display: none;
  }

  .farm-info {
    margin-bottom: 0;
  }
  .item-title {
    display: none;
  }

  .farm-name {
    height: 28px;
  }
  .link-wrap {
    max-width: 100%;
  }
}
</style>
