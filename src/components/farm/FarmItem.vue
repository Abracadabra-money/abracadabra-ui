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
          {{ aprText }}
          <AprTooltip v-if="showAprTooltip" :farm="farm" :top="top" />
          <Tooltip
            v-else
            :width="16"
            :height="16"
            fill="#878B93"
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
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import AprTooltip from "@/components/ui/tooltips/AprTooltip.vue";
import TokenChainIcon from "@/components/ui/icons/TokenChainIcon.vue";

export default {
  props: {
    farm: {
      type: Object,
    },
    top: {
      type: Boolean,
      default: false,
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
          text: "Deprecated",
          flagColor:
            "background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%);",
          border: "border: 1px solid #4a2130;",
        };
      if (this.farm.config?.isNew)
        return {
          text: "New",
          flagColor:
            "background: linear-gradient(0deg, #2d4a96 0%, #5b7cd1 100%);",
          border: "border: 1px solid #304d99;",
        };
      return {
        text: "",
        flagColor: "",
        border: "border: 1px solid rgba(180, 180, 180, 0.08);",
      };
    },

    isOpenedPosition() {
      return (
        Number(this.farm.accountInfo?.depositedBalance) ||
        Number(this.farm.accountInfo?.balance)
      );
    },

    showAprTooltip() {
      return this.farm.isMultiReward;
    },

    aprText() {
      return this.showAprTooltip ? "Boosted Yield" : "APR";
    },
  },

  components: {
    TokenChainIcon,
    Tooltip,
    AprTooltip,
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
  border: 1px solid rgba(180, 180, 180, 0.08);
  border-radius: 16px;
  padding: 21px 12px 16px 12px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  transition: all 0.5s ease-in-out;
}

.farm-item:hover {
  transform: scale(1.01);
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

@media screen and (max-width: 700px) {
  .farm-item {
    width: 100%;
  }
}
</style>
