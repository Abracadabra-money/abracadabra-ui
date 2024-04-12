<template>
  <div class="card">
    <div class="label">Liquidity Provider</div>

    <router-link to="/pool/1/81457" class="manage-btn"> Manage </router-link>

    <div class="pool-info">
      <div class="pool-icon-warp">
        <img
          class="pool-icon icon"
          src="@/assets/images/tokens/MIM-USDB.png"
          alt="MIM/USDB Pool"
        />
        <img
          class="chain-icon"
          :src="getChainIcon(pointsInfo.chainId)"
          alt="Blast chain icon"
        />
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
          {{ formatTokenBalance(pointsInfo.deposited) }}
        </div>
        <div class="deposited-price">
          {{ formatUSD(pointsInfo.depositedUsd) }}
        </div>
      </div>
    </div>

    <div class="point-tabs-wrap">
      <div class="point-tabs">
        <button
          :class="['point-tab', { active: activeTab === 1 }]"
          @click="changeTab(1)"
        >
          <img
            class="tab-icon"
            src="@/assets/images/points-dashboard/blast.png"
            alt=""
          />

          <span>Points</span>
        </button>
        <button
          :class="['point-tab', { active: activeTab === 2 }]"
          @click="changeTab(2)"
        >
          <img
            class="tab-icon"
            src="@/assets/images/points-dashboard/gold-points.svg"
            alt=""
          />
          <span>Gold</span>
        </button>
        <button
          :class="['point-tab', { active: activeTab === 3 }]"
          @click="changeTab(3)"
        >
          <img
            class="tab-icon"
            src="@/assets/images/points-dashboard/potion.png"
            alt=""
          />
          <span>Potions</span>
        </button>
      </div>

      <div class="tab-content">
        <template v-if="activeTab === 1">
          <div class="tab-row">
            <span class="tab-row-title">Points</span>
            <span class="tab-row-value">{{
              formatTokenBalance(pointsInfo.distributionAmount)
            }}</span>
          </div>

          <div class="tab-row">
            <span class="tab-row-title">Your Next Distribution</span>
            <span class="tab-row-value primary">
              {{
                formatTokenBalance(pointsInfo.pendingDistributionAmount)
              }}</span
            >
          </div>

          <div class="line"></div>

          <div class="tab-row">
            <span class="tab-row-title"
              >Pool Rate <Tooltip :width="20" :height="20"
            /></span>
            <span class="tab-row-value">{{
              formatTokenBalance(pointsInfo.totalPendingDistributionAmount)
            }}</span>
          </div>
        </template>

        <template v-if="activeTab === 2">
          <div class="tab-row">
            <span class="tab-row-title">Gold earned</span>
            <span class="tab-row-value">{{
              formatTokenBalance(pointsInfo.goldDistributionAmount)
            }}</span>
          </div>
          <div class="tab-row">
            <span class="tab-row-title">Your Next Distribution</span>
            <span class="tab-row-value">
              {{
                formatTokenBalance(pointsInfo.goldPendingDistributionAmount)
              }}</span
            >
          </div>

          <div class="line"></div>

          <div class="tab-row">
            <span class="tab-row-title"
              >Pool Rate <Tooltip :width="20" :height="20"
            /></span>
            <span class="tab-row-value">{{
              formatTokenBalance(pointsInfo.totalGoldPendingDistributionAmount)
            }}</span>
          </div>
        </template>

        <div class="tab-caming-soon" v-if="activeTab === 3">Coming soon</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

export default {
  emits: ["showWithdrawPopup"],
  props: {
    pointsInfo: {} as any,
    gold: {
      type: Boolean,
      default: false,
    },
    withdrawLogic: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showWithdrawPopup: false,
      activeTab: 1,
    };
  },

  methods: {
    getChainIcon,
    formatTokenBalance,
    formatUSD,

    onWithdraw() {
      this.$emit("showWithdrawPopup");
    },

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

.withdraw-btn {
  position: absolute;
  top: 12px;
  right: 131px;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

// -----

.withdraw-button {
  border: none;
  outline: none;
  width: max-content;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  transition: all 0.3s ease;
  cursor: pointer;
  position: absolute;
  top: 67px;
  right: 24px;
  transition: all 0.3s ease;

  &:hover {
    background: #fcfc06;
    opacity: 0.8;
  }

  &:active {
    background: #fcfc06;
    opacity: 0.8;
  }
}

.boost {
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.list {
  gap: 4px;
  display: flex;
  flex-direction: column;
  list-style: none;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  gap: 4px;
  display: flex;
  align-items: center;
}

.boost {
  box-shadow: 0px 0px 10px 0px rgba(237, 232, 96, 0.1);
}

.gold-title {
  color: #fcfd02;
  text-shadow: 0px 0px 16px #ede860;
  font-size: 16px;
  font-weight: 600;
}

.item-value {
  font-weight: 500;
  color: #fcfd02;
}

.item-amount {
  color: white;
}

.empty {
  font-size: 20px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.total-wrap {
  display: flex;
  justify-content: space-between;
}

.total-title {
  gap: 4px;
  display: flex;
  align-items: center;
}

.total-value {
  font-weight: 500;
}
</style>
