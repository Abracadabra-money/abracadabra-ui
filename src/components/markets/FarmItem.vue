<template>
  <router-link
    :to="goToPage"
    :class="['farm-item', { positionOpened: isOpenedPosition }]"
    :style="farmStatusStyles.border"
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
        <TokenChainIcon
          :icon="farm.icon"
          :name="farm.name"
          :chainId="farm.chainId"
          size="44px"
        />
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
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";
import Tooltip from "@/components/ui/icons/Tooltip.vue";

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
      if (this.farm.isDeprecated)
        return {
          text: "Depreciated",
          flagColor:
            "background: linear-gradient(270deg, #320A0A 0%, #871D1F 100%), linear-gradient(90deg, #67A069 0%, #446A46 100%);",
          border: "border: 1px solid  #320A0A;",
        };
      if (this.farm.isNew)
        return {
          text: "New",
          flagColor:
            "background: linear-gradient(0deg, #2D4A96 0%, #5B7CD1 100%);",
          border: "border: 1px solid  #304D99;",
        };
      return {
        text: "",
        flagColor: "",
        border: "border: 1px solid #2D4A96;",
      };
    },

    isOpenedPosition() {
      return (
        Number(this.farm.accountInfo?.depositedBalance) ||
        Number(this.farm.accountInfo?.balance)
      );
    },
  },

  components: {
    TokenChainIcon,
    Tooltip,
  },
};
</script>

<style lang="scss" scoped>
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
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
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
  align-items: center;
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
      91deg,
      rgba(27, 24, 68, 0.6) 14.68%,
      rgba(13, 19, 38, 0.6) 76.58%
    ),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );

  background-repeat: no-repeat;
}
</style>
