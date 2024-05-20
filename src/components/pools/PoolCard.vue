<template>
  <router-link
    :to="goToPage"
    :class="['pool-item', 'positionOpened']"
    :style="poolStatusStyles.border"
  >
    <div
      class="status-flag"
      :style="poolStatusStyles.flagColor"
      v-if="poolStatusStyles.text"
    >
      <span class="status-flag-text">{{ poolStatusStyles.text }}</span>
    </div>

    <div class="item-header">
      <div class="token-info">
        <BaseTokenIcon :icon="pool.icon" :name="pool.name" size="44px" />
        <span class="token-name">{{ pool.name }}</span>
      </div>
    </div>

    <div class="item-info">
      <div class="apr">
        <div class="tag-title">
          APR
          <Tooltip
            :width="16"
            :height="16"
            fill="#878B93"
            class="tooltip"
            :tooltip="'Annual Return on Staked tokens at current price'"
          />
        </div>
        <p class="tag-value">{{ apr }}</p>
      </div>

      <div class="liquidityValue">
        <div class="tag-title">Liquidity value</div>
        <p class="tag-value">{{ liquidityValue }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapGetters } from "vuex";
import Tooltip from "@/components/ui/icons/Tooltip.vue";
import { formatUSD, formatPercent } from "@/helpers/filters";
import { formatUnits } from "viem";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

export default {
  props: {
    pool: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", getChainById: "getChainById" }),

    apr() {
      return formatPercent(
        formatUnits(this.pool.statisticsData.apr, this.pool.decimals)
      );
    },

    liquidityValue() {
      return formatUSD(
        formatUnits(this.pool.statisticsData.liquidityValue, this.pool.decimals)
      );
    },

    poolStatusStyles() {
      if (this.pool.settings?.isDeprecated)
        return {
          text: "Deprecated",
          flagColor:
            "background: linear-gradient(180deg, #8c4040 0%, #6b2424 100%);",
          border: "border: 1px solid #4a2130;",
        };
      if (this.pool.settings?.isNew)
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

    goToPage() {
      return {
        name: "Pool",
        params: {
          id: this.pool.id,
          poolChainId: this.pool.chainId,
        },
      };
    },
  },

  components: {
    BaseTokenIcon,
    Tooltip,
  },
};
</script>

<style lang="scss" scoped>
.pool-item {
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

.pool-item:hover {
  transform: scale(1.01);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.16);
  z-index: 1;
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
  align-items: flex-end;
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
.liquidityValue {
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

.liquidityValue {
  align-items: end;
}

.liquidityValue .tag-value {
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
  .pool-item {
    width: 100%;
    height: 140px;
  }

  .apr .tag-value {
    font-size: 24px;
  }

  .liquidityValue .tag-value {
    font-size: 14px;
  }
}
</style>
