<template>
  <div class="card">
    <div class="label">Liquidity Provider</div>

    <router-link to="/pool/1/81457" class="manage-btn"> Manage </router-link>

    <div class="pool-info">
      <div class="pool-icon-warp">
        <img
          class="pool-icon"
          src="@/assets/images/tokens/MIM-USDB.png"
          alt="MIM/USDB Pool"
        />
        <img class="chain-icon" :src="blastIcon" alt="Blast chain icon" />
      </div>

      <div>
        <div class="pool-name">MIM/USDB Pool</div>
        <div class="pool-description">Staking Liquidity in Pool</div>
      </div>
    </div>

    <div class="deposited">
      <div class="deposited-text">Deposited</div>
      <div>
        <div class="deposited-amount">
          <img
            class="deposited-icon"
            src="@/assets/images/tokens/MIM-USDB.png"
            alt="MIM/USDB Pool icon"
          />
          {{ formatTokenBalance(userDeposit) }}
        </div>
        <div class="deposited-price">
          {{ userDepositUsd }}
        </div>
      </div>
    </div>

    <div class="point-tabs-wrap">
      <div class="point-tabs">
        <button
          :class="['point-tab', { active: activeTab === index + 1 }]"
          v-for="(tabInfo, index) in tabsInfo"
          :key="index"
          @click="changeTab(index + 1)"
        >
          <img class="tab-icon" :src="tabInfo.icon" :alt="tabInfo.title" />
          <span>{{ tabInfo.title }}</span>
        </button>
      </div>

      <div class="tab-content">
        <template v-if="activeTab === 1">
          <div class="tab-row">
            <span class="tab-row-title">Points</span>
            <span class="tab-row-value">{{ distributionAmount }}</span>
          </div>

          <div class="tab-row">
            <span class="tab-row-title">Your Next Distribution</span>
            <span class="tab-row-value primary">
              {{ pendingDistributionAmount }}</span
            >
          </div>

          <div class="line"></div>

          <div class="tab-row">
            <span class="tab-row-title"
              >Pool Rate
              <Tooltip
                :width="20"
                :height="20"
                tooltip="Hourly distribution towards the entire liquidity pool"
            /></span>
            <span class="tab-row-value">{{
              totalPendingDistributionAmount
            }}</span>
          </div>
        </template>

        <template v-if="activeTab === 2">
          <div class="tab-row">
            <span class="tab-row-title">Gold earned</span>
            <span class="tab-row-value">{{ goldDistributionAmount }}</span>
          </div>
          <div class="tab-row">
            <span class="tab-row-title">Your Next Distribution</span>
            <span class="tab-row-value">
              {{ goldPendingDistributionAmount }}</span
            >
          </div>

          <div class="line"></div>

          <div class="tab-row">
            <span class="tab-row-title"
              >Pool Rate
              <Tooltip
                :width="20"
                :height="20"
                tooltip="Hourly distribution towards the entire liquidity pool"
            /></span>
            <span class="tab-row-value">{{
              totalGoldPendingDistributionAmount
            }}</span>
          </div>
        </template>

        <template v-if="activeTab === 3">
          <div class="tab-row">
            <span class="tab-row-title">Potion earned</span>
            <span class="tab-row-value">{{ potioonDistributionAmount }}</span>
          </div>
          <div class="tab-row">
            <span class="tab-row-title">Your Next Distribution</span>
            <span class="tab-row-value">
              {{ potionPendingDistributionAmount }}</span
            >
          </div>

          <div class="line"></div>

          <div class="tab-row">
            <span class="tab-row-title"
              >Pool Rate
              <Tooltip
                :width="20"
                :height="20"
                tooltip="Hourly distribution towards the entire liquidity pool"
            /></span>
            <span class="tab-row-value">
              {{ totalPotionPendingDistributionAmount }}</span
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

export default {
  props: {
    poolInfo: {
      type: Object,
      default: () => ({}),
    },
    stakeLpBalances: {
      type: Object,
      default: () => ({}),
    },
    userPointsStatistics: {
      type: Object,
      default: () => ({}),
    },
    pointsStatistics: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      activeTab: 1,
      tabsInfo: [
        {
          icon: useImage("assets/images/points-dashboard/blast.png"),
          title: "Points",
        },
        {
          icon: useImage("assets/images/points-dashboard/gold-points.svg"),
          title: "Gold",
        },
        {
          icon: useImage("assets/images/points-dashboard/potion.png"),
          title: "Potions",
        },
      ],
    };
  },

  computed: {
    blastIcon() {
      return getChainIcon(BLAST_CHAIN_ID);
    },

    userDeposit() {
      return Number(
        formatUnits(
          this.stakeLpBalances.unlocked + this.stakeLpBalances.locked || 0n,
          this.poolInfo?.decimals || 18
        )
      );
    },

    userDepositUsd() {
      return formatUSD(this.userDeposit * this.poolInfo?.price || 0);
    },

    distributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.lp?.finalized ?? 0
      );
    },

    pendingDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.lp?.pending ?? 0
      );
    },

    goldDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.developerPoints?.lp?.finalized ?? 0
      );
    },

    potioonDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.potionPoints?.lp?.finalized ?? 0
      );
    },

    goldPendingDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.developerPoints?.lp?.pending ?? 0
      );
    },

    potionPendingDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.potionPoints?.lp?.pending ?? 0
      );
    },

    totalPendingDistributionAmount() {
      return formatTokenBalance(
        this.pointsStatistics?.liquidityPoints?.lp?.pending ?? 0
      );
    },

    totalGoldPendingDistributionAmount() {
      return formatTokenBalance(
        this.pointsStatistics?.developerPoints?.lp?.pending ?? 0
      );
    },

    totalPotionPendingDistributionAmount() {
      return formatTokenBalance(
        this.pointsStatistics?.potionPoints?.lp?.pending ?? 0
      );
    },
  },

  methods: {
    formatTokenBalance,

    changeTab(tab: number) {
      this.activeTab = tab;
    },
  },

  components: {
    Tooltip: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  max-width: 411px;
  width: 100%;
  padding: 42px 16px 16px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #fcfd02;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  gap: 8px;
  display: flex;
  flex-direction: column;
}

.label {
  position: absolute;
  top: 0;
  left: -1px;
  border-radius: 16px 0 8px 0;
  background: #fcfd02;
  width: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.manage-btn {
  box-sizing: border-box;
  position: absolute;
  top: 12px;
  right: 12px;
  max-width: 107px;
  width: 100%;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.01);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.pool-info {
  gap: 10px;
  display: flex;
  align-items: center;
}

.pool-icon-warp {
  position: relative;
  width: 44px;
  height: 44px;
}

.pool-icon {
  width: 44px;
  height: 44px;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  right: -5px;
  border: 1px solid #1f2129;
}

.pool-name {
  font-size: 20px;
  font-weight: 500;
}

.pool-description {
  font-weight: 500;
}

.deposited {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deposited-amount {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 500;
}

.deposited-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.deposited-price {
  text-align: right;
  color: #878b93;
  font-size: 14px;
}

.point-tabs-wrap {
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.4);
}

.point-tabs {
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.point-tab {
  width: 100%;
  background: transparent;
  outline: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
}

.tab-icon {
  width: 24px;
  height: 24px;
}

.active {
  color: #fff;
  border-radius: 8px;
  background: rgba(111, 111, 111, 0.06);
}

.tab-content {
  padding: 12px;
  gap: 8px;
  display: flex;
  flex-direction: column;
}

.tab-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tab-row-title {
  gap: 4px;
  display: flex;
  align-items: center;
}

.tab-row-value {
  font-weight: 500;
}

.primary {
  color: #fcfd02;
}

.line {
  height: 1px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(242, 242, 242, 0.12) 47.5%,
    rgba(255, 255, 255, 0) 100%
  );
}

.tab-caming-soon {
  min-height: 97px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
