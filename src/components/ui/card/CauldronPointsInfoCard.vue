<template>
  <div class="card">
    <div class="label">Cauldron User</div>

    <router-link to="/market/81457/1" class="manage-btn"> Manage </router-link>

    <div class="source-points">
      <div class="icons-wrap">
        <img
          class="source-icon"
          src="@/assets/images/tokens/WETH.png"
          alt="Token icon"
        />

        <img class="chain-icon" :src="blastIcon" alt="Chain icon" />
      </div>

      <div class="source-description">
        <div class="description-title">WETH cauldron</div>
        <div class="description-subtitle">Deposited WETH into Cauldron</div>
      </div>
    </div>

    <div class="deposited">
      <div class="deposited-text">Deposited</div>
      <div class="deposited-value">
        <div class="deposited-amount">
          <img
            class="deposited-icon"
            src="@/assets/images/tokens/WETH.png"
            alt="Token icon"
          />
          {{ userDeposit }}
        </div>
        <div class="deposited-price">
          {{ userDepositUsd }}
        </div>
      </div>
    </div>

    <div class="line"></div>

    <ul class="list">
      <li class="list-item">
        <div class="item-title">Points</div>
        <div class="item-value">
          <div class="item-amount">
            {{ distributionAmount }}
          </div>
        </div>
      </li>

      <li class="list-item">
        <div :class="['item-title']">Your Next Distribution</div>
        <div :class="['item-value']">
          {{ pendingDistributionAmount }}
        </div>
      </li>
    </ul>

    <div class="line"></div>

    <div class="total-wrap">
      <span class="total-title"
        >Cauldron Rate
        <Tooltip
          tooltip="Hourly distribution towards the Cauldron Users"
          :width="20"
          :height="20"
      /></span>
      <span class="total-value">{{ totalPending }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { BLAST_CHAIN_ID } from "@/constants/global";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";

export default {
  props: {
    cauldronInfo: {
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

  computed: {
    blastIcon() {
      return getChainIcon(BLAST_CHAIN_ID);
    },

    userDeposit() {
      return formatTokenBalance(
        this.cauldronInfo?.userPosition?.collateralDeposited ?? 0
      );
    },

    userDepositUsd() {
      return formatUSD(
        this.cauldronInfo?.userPosition?.collateralDepositedUsd ?? 0
      );
    },

    distributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.cauldron?.finalized ?? 0
      );
    },

    pendingDistributionAmount() {
      return formatTokenBalance(
        this.userPointsStatistics?.liquidityPoints?.cauldron?.pending ?? 0
      );
    },

    totalPending() {
      return formatTokenBalance(
        this.pointsStatistics?.liquidityPoints?.cauldron?.total?.pending ?? 0
      );
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
  padding: 42px 16px 22px;
  border-radius: 16px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  border: 1px solid #fcfd02;
  margin: 0 auto;
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

.item-value {
  font-weight: 500;
  color: #fcfd02;
}

.item-amount {
  color: white;
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
