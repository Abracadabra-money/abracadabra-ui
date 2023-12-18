<template>
  <div class="swap-fee" :class="{ warning: priceImpact?.isHighPriceImpact }">
    <span class="fee-title">
      <!-- <Tooltip class="tooltip" :tooltip="tooltipText" /> -->
      Price Impact
    </span>
    <span class="price-value">{{
      priceImpact?.swapFee ? priceImpact.swapFee : 0
    }}</span>
  </div>
  <p class="warning-text" v-if="priceImpact?.isHighPriceImpact">
    Warning! Swap impact is high.
  </p>
</template>

<script>
// import Tooltip from "@/components/ui/icons/Tooltip.vue";
import { getDepositAmountsAndFee } from "@/helpers/gm/getDepositAmount";
import { getWithdrawalAmountsAndFees } from "@/helpers/gm/getWithdrawalAmounts";
import { BigNumber, utils } from "ethers";
import { formatDeltaUsd } from "@/helpers/gm/numbers.ts";

const ACTION_LEVERAGE = 1;
const ACTION_DELEVERAGE = 2;

const emptyState = {
  swapFee: 0,
  isHighPriceImpact: false,
};

export default {
  props: {
    cauldronObject: {
      type: Object,
    },
    amount: {},
    actionType: {
      default: ACTION_LEVERAGE,
    },
  },
  data() {
    return {
      tooltipText: "Swap price impact",
    };
  },
  computed: {
    isWarning() {
      return false;
    },
    toShortTokenAmount() {
      const shortAmount = this.amount.div(1e12);
      return shortAmount;
    },
    priceImpact() {
      if (!this.cauldronObject) return emptyState;

      if (this.actionType === ACTION_LEVERAGE) return this.priceImpactDeposit;
      if (this.actionType === ACTION_DELEVERAGE)
        return this.priceImpactWithdraw;
    },
    priceImpactDeposit() {
      if (
        this.actionType !== ACTION_LEVERAGE ||
        (this.amount && +this.amount === 0)
      )
        return emptyState;

      const { gmInfo } = this.cauldronObject.additionalInfo;

      const { fees, isHighPriceImpact } = getDepositAmountsAndFee(
        gmInfo.marketInfo,
        gmInfo.marketFullInfo,
        gmInfo.dataStoreInfo,
        this.toShortTokenAmount
      );

      const { swapPriceImpact } = fees;

      return {
        swapFee: formatDeltaUsd(swapPriceImpact.deltaUsd, swapPriceImpact.bps),
        isHighPriceImpact,
      };
    },
    priceImpactWithdraw() {
      if (
        this.actionType !== ACTION_DELEVERAGE ||
        (this.amount && +this.amount === 0)
      )
        return emptyState;
      const { gmInfo } = this.cauldronObject.additionalInfo;

      const { fees, isHighPriceImpact } = getWithdrawalAmountsAndFees(
        gmInfo.marketInfo,
        gmInfo.marketFullInfo,
        gmInfo.dataStoreInfo,
        this.amount
      );

      const { swapPriceImpact } = fees;

      return {
        swapFee: formatDeltaUsd(swapPriceImpact.deltaUsd, swapPriceImpact.bps),
        isHighPriceImpact,
      };
    },
  },

  // components: { Tooltip },
};
</script>

<style lang="scss" scoped>
.swap-fee {
  padding: 13px 16px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.warning {
  background: rgba(255, 148, 173, 0.06);
  border: 1px solid #e54369;
}

.warning .price-title {
  color: #e54369;
}

.fee-title {
  display: flex;
  align-items: center;
}

.tooltip {
  margin-right: 5px;
  cursor: pointer;
}

.warning-text {
  text-align: left;
  color: #cc123f;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
}

@media (max-width: 375px) {
  .execution-price,
  .warning {
    font-size: 14px;
  }
}
</style>
