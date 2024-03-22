<template>
  <div :class="['card', { gold: pointsInfo?.isGold }]">
    <div class="label">{{ pointsInfo.label }}</div>

    <!-- design will change -->
    <button
      v-if="showWithdrawButton"
      class="withdraw-button"
      @click="onWithdraw"
    >
      Withdraw
    </button>

    <div class="source-points">
      <div class="icons-wrap">
        <img class="source-icon" :src="pointsInfo.icon" alt="Token icon" />

        <img
          class="chain-icon"
          :src="getChainIcon(pointsInfo.chainId)"
          alt="Chain icon"
        />
      </div>

      <div class="source-description">
        <div class="description-title">{{ pointsInfo.title }}</div>
        <div class="description-subtitle">{{ pointsInfo.subtitle }}</div>
      </div>
    </div>

    <div class="deposited">
      <div class="deposited-text">
        Deposited
        <span
          class="lock"
          v-if="pointsInfo.isGold"
          v-tooltip="'Locked for 3 months'"
        >
          <svg
            class="lock-icon"
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
      <div class="deposited-value">
        <div class="deposited-amount">
          <img class="deposited-icon" :src="pointsInfo.icon" alt="Token icon" />
          {{ formatTokenBalance(pointsInfo.deposited) }}
        </div>
        <div class="deposited-price">
          {{ formatUSD(pointsInfo.depositedUsd) }}
        </div>
      </div>
    </div>

    <div class="line"></div>

    <ul class="list">
      <li class="list-item">
        <div class="item-title">Points Earned</div>
        <div class="item-value">
          <div class="item-amount">
            {{ formatTokenBalance(pointsInfo.distributionAmount) }}
          </div>
        </div>
      </li>

      <li class="list-item">
        <div :class="['item-title', { 'gold-title': pointsInfo.isGold }]">
          To Be Distributed
          <span class="boost" v-if="pointsInfo.isGold">
            <img
              v-tooltip="'Boosted Airdrop for Founders'"
              src="@/assets/images/points-dashboard/rocket.svg"
              alt=""
            />
          </span>
        </div>
        <div :class="['item-value', { 'gold-title': pointsInfo.isGold }]">
          {{ formatTokenBalance(pointsInfo.pendingDistributionAmount) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
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
    };
  },
  computed: {
    showWithdrawButton() {
      return this.withdrawLogic && this.pointsInfo?.deposited > 0;
    }
  },

  methods: { getChainIcon, formatTokenBalance, formatUSD, onWithdraw() {
    this.$emit("showWithdrawPopup");
  } },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  max-width: 411px;
  width: 100%;
  padding: 40px 16px 22px;
  border-radius: 16px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  border: 1px solid #fcfd02;
  margin: 0 auto;
}

.withdraw-button {
  border: none;
  outline: none;
  width: max-content;
  padding: 0 10px;
  height: 39px;
  border-radius: 10px;
  background: rgb(252, 253, 2);
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
  top: 8px;
  right: 8px;
  transition: all 0.3s ease;

  &:hover {
    top: 6px;
    background: #fcfc06;
    opacity: 0.8;
  }

  &:active {
    top: 8px;
    background: #fcfc06;
    opacity: 0.8;
  }
}

.gold {
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
}

.label {
  position: absolute;
  top: 0;
  left: -1px;
  border-radius: 16px 0 8px 0;
  background: #fcfd02;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.source-points {
  gap: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.icons-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  margin-right: 6px;
}

.source-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -10px;
  border: 1px solid #0d1427;
}

.source-description {
  font-weight: 500;
}

.description-title {
  font-size: 20px;
  line-height: 150%;
}

.description-subtitle {
  font-size: 16px;
  line-height: 150%;
}

.deposited {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deposited-text {
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
}

.lock,
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

.deposited-value {
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
}

.deposited-amount {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.deposited-price {
  text-align: right;
  color: #878b93;
  font-size: 14px;
}

.deposited-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.line {
  height: 1px;
  width: 100%;
  margin: 8px 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(242, 242, 242, 0.12) 47.5%,
    rgba(255, 255, 255, 0) 100%
  );
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
}

.item-amount {
  color: #fcfd02;
}
</style>
