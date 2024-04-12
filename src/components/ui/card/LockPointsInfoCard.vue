<template>
  <div class="card">
    <div class="label">Liquidity Provider</div>

    <button class="lock-btn" @click="showLockList = !showLockList">Lock</button>

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
        <div class="pool-description">
          Receive 20% of total ecosystem points
        </div>
      </div>
    </div>

    <div class="deposited">
      <div class="deposited-text">
        Deposited
        <span class="lock-icon-wrap" v-tooltip="'Locked for 3 months'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.375 4.375H9.625V3.0625C9.625 2.36631 9.34844 1.69863 8.85616 1.20634C8.36387 0.714062 7.69619 0.4375 7 0.4375C6.30381 0.4375 5.63613 0.714062 5.14384 1.20634C4.65156 1.69863 4.375 2.36631 4.375 3.0625V4.375H2.625C2.39294 4.375 2.17038 4.46719 2.00628 4.63128C1.84219 4.79538 1.75 5.01794 1.75 5.25V11.375C1.75 11.6071 1.84219 11.8296 2.00628 11.9937C2.17038 12.1578 2.39294 12.25 2.625 12.25H11.375C11.6071 12.25 11.8296 12.1578 11.9937 11.9937C12.1578 11.8296 12.25 11.6071 12.25 11.375V5.25C12.25 5.01794 12.1578 4.79538 11.9937 4.63128C11.8296 4.46719 11.6071 4.375 11.375 4.375ZM5.25 3.0625C5.25 2.59837 5.43437 2.15325 5.76256 1.82506C6.09075 1.49687 6.53587 1.3125 7 1.3125C7.46413 1.3125 7.90925 1.49687 8.23744 1.82506C8.56563 2.15325 8.75 2.59837 8.75 3.0625V4.375H5.25V3.0625ZM11.375 11.375H2.625V5.25H11.375V11.375Z"
              fill="white"
            />
          </svg>
        </span>
      </div>
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

    <div class="point-tabs-wrap" v-if="!showLockList">
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

    <div class="user-locks" v-else>
      <div
        class="lock-item"
        v-for="(userLock, index) in userLocks"
        :key="index"
      >
        <div class="pool-info">
          <img src="@/assets/images/tokens/MIM-USDB.png" alt="MIM/USDB Pool" />

          <div>
            <div class="lock-amount">
              {{ formatTokenBalance(userLock.amount) }}
            </div>
            <div class="lock-amount-usd">
              {{ formatUSD(userLock.amountUsd) }}
            </div>
          </div>
        </div>

        <div>
          <Timer
            class="timer"
            :endDateTimestamp="Number(userLock.unlockTime)"
            small
            gap="4px"
            padding="6px"
            width="44px"
          />
          <div class="unlocks-text">Unlocks in</div>
        </div>
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
    userLocks: {} as any,
  },

  data() {
    return {
      showWithdrawPopup: false,
      activeTab: 1,
      showLockList: false,
    };
  },

  computed: {
    tabsContentData() {
      return [
        {
          title: "Points",
          earned: this.pointsInfo.distributionAmount,
          distributed: this.pointsInfo.pendingDistributionAmount,
          total: this.pointsInfo.totalPendingDistributionAmount,
        },
        {
          title: "Gold earned",
          earned: this.pointsInfo.goldDistributionAmount,
          distributed: this.pointsInfo.goldPendingDistributionAmount,
          total: this.pointsInfo.totalGoldPendingDistributionAmount,
        },
        null,
      ];
    },

    cardText() {
      if (this.activeTab === 2) return "Gold earned ";
      return "Points";
    },

    userPointsInfo() {
      if (this.activeTab === 1)
        return {
          earned: this.pointsInfo.distributionAmount,
          distributed: this.pointsInfo.pendingDistributionAmount,
          total: this.pointsInfo.totalPendingDistributionAmount,
        };

      return {
        earned: this.pointsInfo.goldDistributionAmount,
        distributed: this.pointsInfo.goldPendingDistributionAmount,
        total: this.pointsInfo.totalGoldPendingDistributionAmount,
      };
    },
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
    Timer: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.card {
  position: relative;
  max-width: 411px;
  width: 100%;
  padding: 42px 16px 16px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #fcfd02;
  background: linear-gradient(
      104deg,
      rgba(251, 253, 3, 0.21) 0%,
      rgba(251, 253, 3, 0.21) 28.64%,
      rgba(254, 255, 172, 0.21) 52.14%,
      rgba(253, 255, 0, 0.21) 70.64%,
      rgba(253, 255, 0, 0.21) 100%
    ),
    linear-gradient(
      146deg,
      rgba(35, 0, 0, 0.07) 0%,
      rgba(156, 0, 0, 0.07) 101.49%
    ),
    linear-gradient(
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

.lock-btn {
  box-sizing: border-box;
  position: absolute;
  top: 12px;
  right: 12px;
  max-width: 80px;
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
  cursor: pointer;
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

.deposited-text {
  gap: 4px;
  display: flex;
  align-items: center;
}

.lock-icon-wrap {
  width: 20px;
  height: 20px;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgba(0, 0, 0, 0.2);
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
  background: #101217;
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

.user-locks {
  max-height: 170px;
  overflow-y: scroll;
  gap: 8px;
  display: flex;
  flex-direction: column;
}

.lock-item {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #fcfd02;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lock-amount {
  font-weight: 500;
}

.lock-amount-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.unlocks-text {
  text-align: center;
  color: #878b93;
  font-size: 12px;
}
</style>
