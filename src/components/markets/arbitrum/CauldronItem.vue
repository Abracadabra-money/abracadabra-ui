<template>
  <router-link
    :to="goToCauldron"
    class="cauldron-item"
    :class="{ outline: cauldronSettings.isGMXMarket }"
  >
    <div class="cauldron-info">
      <div class="collateral-info">
        <TokenChainIcon
          :name="cauldronConfig.name"
          :icon="cauldronConfig.icon"
        />
        <div class="collateral-labels">
          <span>{{ cauldronConfig.name }}</span>
          <span class="new-label" v-if="isNewLabel">New</span>
          <span class="deprecated-label" v-if="isDeprecatedCauldron"
            >Deprecated</span
          >
        </div>
      </div>

      <div class="cauldron-stats" v-for="(stats, i) in cauldronInfo" :key="i">
        <span class="stats-title">{{ stats.title }}</span>
        <span class="stats-value">{{ stats.value }}</span>
      </div>
      <div class="loader-wrap" v-if="isLoadingApy">
        <Loader type="loader" />
      </div>
      <div v-else>
        <span class="stats-title">APY RANGE</span>
        <span class="stats-value">{{ apyRange }}</span>
      </div>

      <div class="cauldron-links" v-if="!isDeprecatedCauldron">
        <router-link class="cauldron-link" :to="goToPage('BorrowId')"
          >Borrow</router-link
        >
        <router-link
          class="cauldron-link"
          v-if="hasLeverage"
          :to="goToPage('LeverageId')"
          >Leverage</router-link
        >
      </div>
    </div>
  </router-link>
</template>

<script>
import { utils } from "ethers";
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import TokenChainIcon from "@/components/ui/icons/arbitrum/TokenChainIcon.vue";
import Loader from "@/components/base/BaseLoader.vue";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";

export default {
  props: {
    cauldron: {
      type: Object,
    },
  },

  data() {
    return {
      isApyExist: false,
      isLoadingApy: false,
      collateralApy: null,
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", getChainById: "getChainById" }),

    chainIcon() {
      return this.getChainById(this.chainId).icon;
    },

    goToCauldron() {
      const name = this.isDeprecatedCauldron ? "RepayId" : "BorrowId";

      return {
        name,
        params: { id: this.cauldronConfig.id },
      };
    },

    apyRange() {
      let maxLoop = 4;

      if (this.cauldron.config.mcr === 85) maxLoop = 6.4;

      if (this.collateralApy)
        return `${filters.formatPercent(
          this.collateralApy
        )} - ${filters.formatPercent(this.collateralApy * maxLoop)}`;
      return "-";
    },

    cauldronInfo() {
      return [
        {
          title: "TOTAL MIM BORROWED",
          value: filters.formatLargeSum(
            utils.formatUnits(this.cauldron.totalBorrowed)
          ),
        },
        {
          title: "TVL",
          value: `$ ${filters.formatLargeSum(
            utils.formatUnits(this.cauldron.tvl)
          )}`,
        },
        {
          title: "MIMS LEFT TO BORROW",
          value: filters.formatLargeSum(
            utils.formatUnits(this.cauldron.mimLeftToBorrow)
          ),
        },
        {
          title: "INTEREST",
          value: `${filters.formatPercent(this.cauldron.interest)}`,
        },
      ];
    },

    isDeprecatedCauldron() {
      if (this.cauldronSettings) return this.cauldronSettings.isDepreciated;
      return false;
    },

    hasLeverage() {
      return (
        this.cauldronSettings?.isSwappersActive &&
        !!this.cauldronConfig?.leverageInfo
      );
    },

    isNewLabel() {
      return this.cauldron.config.cauldronSettings.isNew;
    },

    cauldronConfig() {
      return this.cauldron?.config;
    },

    cauldronSettings() {
      return this.cauldron.config.cauldronSettings;
    },
  },

  methods: {
    goToPage(name) {
      return { name, params: { id: this.cauldronConfig.id } };
    },

    async initApy() {
      this.isApyExist = isApyCalcExist(this.chainId, this.cauldron.config.id);
      if (!this.isApyExist) return false;
      this.isLoadingApy = true;
      this.collateralApy = await fetchTokenApy(this.cauldron);
      this.isLoadingApy = false;
    },
  },

  async created() {
    await this.initApy();
  },

  components: {
    TokenChainIcon,
    Loader,
  },
};
</script>

<style lang="scss" scoped>
.cauldron-item {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(8, 14, 31, 0.6);
  backdrop-filter: blur(50px);
  line-height: 21px;
  padding: 0 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  color: white;
  text-align: left;
  box-shadow: 0 0 0 1px transparent;
  transition: all 0.2s;
  height: 70px;
  border-radius: 30px;

  &.outline {
    box-shadow: 0px 0px 8px 0px rgba(113, 91, 208, 0.2), 0px 0px 3px 0px #4651ab;
  }
}

.cauldron-item:hover {
  background: #343141;
}

.cauldron-info {
  display: grid;
  grid-template-columns: 1.2fr 0.7fr 0.7fr 0.7fr 0.7fr 1fr 180px;
  align-items: center;
  width: 100%;
  height: 36px;
}

.collateral-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
}

.collateral-labels {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 28px;
}

.new-label {
  width: 45px;
  background: #6372f8;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 10px;
}

.deprecated-label {
  width: max-content;
  background: #d94844;
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  padding: 0 10px;
}

.stats-title {
  display: none;
}

.cauldron-links {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cauldron-link {
  width: 84px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

@media screen and (max-width: 1024px) {
  .cauldron-item {
    font-size: 14px;
    border-radius: 30px;
    height: auto;
  }

  .cauldron-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: auto;
    gap: 5px;
  }

  .chain-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .chain-title,
  .stats-title {
    display: block;
    text-transform: uppercase;
  }

  .stats-title {
    color: rgba(255, 255, 255, 0.6);
  }

  .collateral-info {
    margin-bottom: 6px;
  }

  .collateral-labels {
    height: auto;
  }
}
</style>
