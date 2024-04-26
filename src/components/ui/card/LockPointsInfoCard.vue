<template>
  <div class="card">
    <div class="label">Founder Boost</div>

    <button
      class="lock-btn"
      v-if="userLocks.length"
      @click="showLockList = !showLockList"
    >
      Lock
    </button>

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
        <div class="pool-description">
          Receive 20% of total ecosystem points
        </div>
      </div>
    </div>

    <div class="deposited">
      <div class="deposited-text">
        Deposited
        <span
          class="lock-icon-wrap"
          v-tooltip="'Locked funds, earning extra rewards'"
        >
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
          {{ formatTokenBalance(userDeposit) }}
        </div>
        <div class="deposited-price">
          {{ userDepositUsd }}
        </div>
      </div>
    </div>

    <div class="bonus-wrap" v-if="+oneFounderBonus || +goldOneFounderBonus">
      Early Founder’s bonus

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        @mousemove="isBonusTooltipOpen = true"
        @mouseleave="isBonusTooltipOpen = false"
      >
        <path
          d="M10 3.125L9.99943 3.125C8.04429 3.12722 6.16986 3.90488 4.78737 5.28737C3.40488 6.66987 2.62722 8.5443 2.625 10.4994V10.5C2.625 11.9586 3.05754 13.3845 3.86791 14.5973C4.67829 15.8101 5.8301 16.7554 7.17771 17.3136C8.52531 17.8718 10.0082 18.0179 11.4388 17.7333C12.8694 17.4487 14.1835 16.7463 15.2149 15.7149C16.2463 14.6835 16.9487 13.3694 17.2333 11.9388C17.5179 10.5082 17.3718 9.02532 16.8136 7.67771C16.2554 6.33011 15.3101 5.17829 14.0973 4.36791C12.8845 3.55754 11.4586 3.125 10 3.125ZM9.63623 6.81944L9.24948 6.56102L9.63623 6.81944C9.6843 6.7475 9.75263 6.69142 9.83258 6.65831C9.91252 6.62519 10.0005 6.61653 10.0854 6.63341C10.1702 6.65029 10.2482 6.69196 10.3094 6.75314C10.3705 6.81433 10.4122 6.89229 10.4291 6.97715C10.446 7.06202 10.4373 7.14998 10.4042 7.22993C10.3711 7.30987 10.315 7.3782 10.2431 7.42627C10.1711 7.47434 10.0865 7.5 10 7.5C9.88397 7.5 9.77269 7.45391 9.69064 7.37186C9.60859 7.28981 9.5625 7.17853 9.5625 7.0625C9.5625 6.97597 9.58816 6.89139 9.63623 6.81944ZM14.2362 16.84C12.9824 17.6777 11.5084 18.1249 10.0005 18.125C7.97875 18.1229 6.04042 17.3188 4.61082 15.8892C3.18128 14.4596 2.3772 12.5214 2.375 10.4997C2.37505 8.99174 2.82225 7.51763 3.66004 6.26378C4.49789 5.00986 5.68875 4.03254 7.08204 3.45542C8.47533 2.8783 10.0085 2.7273 11.4876 3.02152C12.9667 3.31573 14.3253 4.04194 15.3917 5.10831C16.4581 6.17469 17.1843 7.53333 17.4785 9.01244C17.7727 10.4915 17.6217 12.0247 17.0446 13.418C16.4675 14.8113 15.4901 16.0021 14.2362 16.84ZM10.125 9.875V14.25C10.125 14.2832 10.1118 14.3149 10.0884 14.3384C10.0649 14.3618 10.0331 14.375 10 14.375C9.96685 14.375 9.93505 14.3618 9.91161 14.3384C9.88817 14.3149 9.875 14.2832 9.875 14.25V9.875C9.875 9.84185 9.88817 9.81006 9.91161 9.78661C9.93505 9.76317 9.96685 9.75 10 9.75C10.0332 9.75 10.0649 9.76317 10.0884 9.78662C10.1118 9.81006 10.125 9.84185 10.125 9.875Z"
          fill="black"
          stroke="black"
        />
      </svg>

      <div class="bonus-tooltip triangle" v-show="isBonusTooltipOpen">
        <div class="bonus-row">
          <span class="bonus-info">
            <img
              class="bonus-icon"
              src="@/assets/images/points-dashboard/blast.png"
              alt=""
            />
            {{ oneFounderBonus }}
          </span>
        </div>

        <div class="bonus-row">
          <span class="bonus-info">
            <img
              class="bonus-icon"
              src="@/assets/images/points-dashboard/gold-points.svg"
              alt=""
            />
            {{ goldOneFounderBonus }}
          </span>
        </div>

        <div class="bonus-discription">
          Early Founder only rewards distribution. Thanks for participating in
          LLE
        </div>
      </div>
    </div>

    <div class="point-tabs-wrap" v-if="!showLockList">
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
            <span class="tab-row-title primary"
              >Your Next Distribution
              <span class="boost">
                <img
                  v-tooltip="
                    'Locked LPs benefit from both rewards distributions: Staked and Locked. Upon unlocking, locked LPs transition to Staked LPs'
                  "
                  src="@/assets/images/points-dashboard/rocket.svg"
                  alt=""
                />
              </span>
            </span>
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
                tooltip="Pending rewards for the Founders"
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
            <span class="tab-row-title primary"
              >Your Next Distribution
              <span class="boost">
                <img
                  v-tooltip="'Boosted Airdrop for Founders'"
                  src="@/assets/images/points-dashboard/rocket.svg"
                  alt=""
                /> </span
            ></span>
            <span class="tab-row-value primary">
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
                tooltip="Pending rewards for the Founders"
            /></span>
            <span class="tab-row-value">{{
              totalGoldPendingDistributionAmount
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
          <img
            class="pool-lock-icon"
            src="@/assets/images/tokens/MIM-USDB.png"
            alt="MIM/USDB Pool"
          />

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
            small
            isLock
            gap="4px"
            width="44px"
            padding="4px"
            height="26px"
            :endDateTimestamp="Number(userLock.unlockTime)"
          />
          <div class="unlocks-text">Unlocks in</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { useImage } from "@/helpers/useImage";

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
    userLocks: {
      type: Array,
      default: () => [],
    } as any,
  },

  data() {
    return {
      activeTab: 1,
      showLockList: false,
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
      isBonusTooltipOpen: false,
    };
  },

  computed: {
    blastIcon() {
      return getChainIcon(BLAST_CHAIN_ID);
    },

    userDeposit() {
      return Number(
        formatUnits(
          this.stakeLpBalances.locked || 0n,
          this.poolInfo?.decimals || 18
        )
      );
    },

    userDepositUsd() {
      return formatUSD(this.userDeposit * this.poolInfo?.price || 0);
    },

    distributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.founder?.finalized +
          this.userPointsStatistics?.liquidityPoints?.phaseOneFounderBonus
            ?.finalized ?? 0
      );
    },

    oneFounderBonus() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.phaseOneFounderBonus
          ?.finalized ?? 0
      );
    },

    pendingDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.founder?.pending +
          this.userPointsStatistics?.liquidityPoints?.phaseOneFounderBonus
            ?.pending ?? 0
      );
    },

    goldDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.developerPoints?.founder?.finalized +
          this.userPointsStatistics?.developerPoints?.phaseOneFounderBonus
            ?.finalized ?? 0
      );
    },

    goldOneFounderBonus() {
      return formatTokenBalance(
        this.userPointsStatistics?.developerPoints?.phaseOneFounderBonus
          ?.finalized ?? 0
      );
    },

    goldPendingDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.developerPoints?.founder?.pending +
          this.userPointsStatistics?.developerPoints?.phaseOneFounderBonus
            ?.pending ?? 0
      );
    },

    totalPendingDistributionAmount() {
      return formatTokenBalance(
        this.pointsStatistics?.liquidityPoints?.founder?.pending ?? 0
      );
    },

    totalGoldPendingDistributionAmount() {
      return formatTokenBalance(
        this.pointsStatistics?.developerPoints?.founder?.pending ?? 0
      );
    },
  },

  methods: {
    formatUSD,
    formatTokenBalance,

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

.bonus-wrap {
  position: relative;
  width: 100%;
  height: 25px;
  background-image: url("@/assets/images/blast/early-label.svg");
  background-repeat: no-repeat;
  background-size: contain;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 500;
}

.bonus-tooltip {
  position: absolute;
  bottom: 150%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  z-index: 10;
  padding: 12px 20px;
  border-radius: 12px;
  background: #070b14;
  backdrop-filter: blur(16px);
  gap: 8px;
  display: flex;
  flex-direction: column;
}

.triangle::after {
  content: "";
  position: absolute;
  transition: all 0.3s ease-in;
  bottom: -20px;
  left: 71%;
  border-top: 10px solid black;
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}

.bonus-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.bonus-info {
  gap: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
}

.bonus-icon {
  width: 16px;
  height: 16px;
}

.bonus-discription {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
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
  text-shadow: 0px 0px 16px #ede860;
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
  box-shadow: 0px 0px 10px 0px rgba(237, 232, 96, 0.1);
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
  min-height: 170px;
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

.pool-lock-icon {
  width: 32px;
  height: 32px;
}

.lock-amount {
  font-weight: 500;
  line-height: 120%;
}

.lock-amount-usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 120%;
}

.unlocks-text {
  text-align: center;
  color: #878b93;
  font-size: 12px;
  line-height: 120%;
}

@media screen and (max-width: 1200px) {
  .triangle::after {
    left: calc(50% - 10px);
  }
}
</style>
