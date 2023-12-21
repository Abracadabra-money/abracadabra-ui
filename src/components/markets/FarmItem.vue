<template>
  <div class="gradient-background" :style="farmStatusStyles.backgroundColor">
    <router-link
      :to="goToPage"
      :class="['farm-item', { positionOpened: isOpenedPosition }]"
    >
      <div
        class="status-flag"
        :style="farmStatusStyles.flagColor"
        v-if="farmStatusStyles.text"
      >
        <span class="status-flag-text">{{ farmStatusStyles.text }}</span>
      </div>

      <div class="item-header">
        <div class="token-info">
          <div class="token-info-icon">
            <BaseTokenIcon :icon="farm.icon" :name="farm.name" size="32px" />
            <img class="token-chain" :src="getChainIcon(farm.chainId)" />
          </div>
          <span class="token-name">{{ farm.name }}</span>
        </div>
      </div>

      <div class="item-info">
        <div class="apr">
          <div class="tag-title">
            APR
            <Tooltip
              class="tooltip"
              :tooltip="'Annual Return on Staked tokens at current price'"
            />
          </div>
          <p class="tag-value">{{ apr }}</p>
        </div>

        <div class="tvl">
          <div class="tag-title">TVL</div>
          <p class="tag-value">{{ tvl }}</p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import ChainTag from "@/components/ui/ChainTag.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  props: {
    farm: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", getChainById: "getChainById" }),

    goToPage() {
      return {
        name: "Farm",
        params: { id: this.farm.id, farmChainId: this.farm.chainId },
      };
    },

    apr() {
      return filters.formatPercent(this.farm.farmRoi);
    },

    tvl() {
      return filters.formatUSD(this.farm.farmTvl);
    },

    farmStatusStyles() {
      if (this.farm.isDepreciated)
        return {
          text: "Depreciated",
          flagColor:
            "background: linear-gradient(270deg, #320A0A 0%, #871D1F 100%), linear-gradient(90deg, #67A069 0%, #446A46 100%);",
          backgroundColor:
            "background: linear-gradient(90deg, rgba(50,10,10,1) 0%, rgba(50,10,10,1) 50%, rgba(0,0,0,0) 100%); backdrop-filter: blur(12.5px);",
        };
      if (this.farm.isNew)
        return {
          text: "new",
          flagColor:
            "background: linear-gradient(218deg, #67A069 23.2%, #446A46 79.7%);",
          backgroundColor:
            "background: linear-gradient(90deg, rgba(103,160,105,1) 0%, rgba(68,106,70,1) 50%, rgba(0,0,0,0) 100%); backdrop-filter: blur(12.5px);",
        };
      return {
        text: "",
        flagColor: "",
        backgroundColor:
          "background: linear-gradient(90deg, rgba(45,74,150,1) 0%, rgba(45,88,150,1) 50%, rgba(0,0,0,0) 100%); backdrop-filter: blur(12.5px);",
      };
    },

    isOpenedPosition() {
      return !!Number(this.farm.accountInfo?.depositedBalance);
    },
  },

  methods: {
    getChainIcon,
  },

  components: {
    BaseTokenIcon,
    ChainTag,
    Tooltip,
  },
};
</script>

<style lang="scss" scoped>
.gradient-background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 302px;
  height: 160px;
  border-radius: 16px;
}

.farm-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  height: 158px;
  border-radius: 16px;
  padding: 21px 12px 16px 12px;
  background: linear-gradient(
    146deg,
    rgb(1, 12, 39) 50%,
    rgb(7, 26, 46) 101.49%
  );

  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  transition: box-shadow 0.5s;
}

.farm-item:hover {
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
}

.item-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.token-info {
  display: flex;
  align-items: start;
}

.token-info-icon {
  position: relative;
}

.token-chain {
  position: absolute;
  top: -4px;
  right: 4px;
  width: 15px;
  height: 15px;
}

.token-name {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.tag-title {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.apr,
.tvl {
  display: flex;
  flex-direction: column;
}

.apr {
  align-items: start;
}

.apr .tag-value {
  color: white;
  text-shadow: 0px 0px 16px rgba(171, 93, 232, 0.55);
  font-size: 30px;
  font-weight: 600;
}

.tvl {
  align-items: end;
}

.tvl .tag-value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.tooltip {
  width: 16px;
  height: 16px;
}

.status-flag {
  position: absolute;
  top: -1px;
  left: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 117px;
  height: 15px;
  border-radius: 16px 0 8px 0px;
  background: linear-gradient(218deg, #67a069 23.2%, #446a46 79.7%);
}

.status-flag-text {
  text-align: center;
  color: #fff;
  font-size: 10px;
  font-weight: 500;
}

.positionOpened {
  background: url("../../assets/images/farm/farm-opened-position-background.png"),
    linear-gradient(
      90deg,
      rgb(26, 14, 78) 0%,
      rgb(15, 8, 62) 50%,
      rgb(1, 12, 39) 100%
    );

  background-repeat: no-repeat;
}
</style>
