<template>
  <div class="price-impact">
    <div class="title">
      GM Price impact
      <TooltipIcon
        :width="20"
        :height="20"
        fill="#878B93"
        :tooltip="tooltipText"
      />
    </div>
    <div class="value" :class="{ warning: priceImpact?.isHighPriceImpact }">
      {{ priceImpact?.swapFee ? priceImpact.swapFee : 0 }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { getDepositAmountsAndFee } from "@/helpers/gm/getDepositAmount";
import { getWithdrawalAmountsAndFees } from "@/helpers/gm/getWithdrawalAmounts";
import { formatDeltaUsd } from "@/helpers/gm/numbers";
import { BigNumber } from "ethers";

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
    amount: {
      default: BigNumber.from(0),
    },
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
      //@ts-ignore
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
      //@ts-ignore
      const { gmInfo } = this.cauldronObject.additionalInfo;

      const { fees, isHighPriceImpact } = getDepositAmountsAndFee(
        gmInfo.marketInfo,
        gmInfo.marketFullInfo,
        gmInfo.dataStoreInfo,
        this.toShortTokenAmount
      );

      const { swapPriceImpact } = fees;

      return {
        //@ts-ignore
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
      //@ts-ignore
      const { gmInfo } = this.cauldronObject.additionalInfo;
      //@ts-ignore
      const { fees, isHighPriceImpact } = getWithdrawalAmountsAndFees(
        gmInfo.marketInfo,
        gmInfo.marketFullInfo,
        gmInfo.dataStoreInfo,
        //@ts-ignore
        this.amount
      );

      const { swapPriceImpact } = fees;

      return {
        swapFee: formatDeltaUsd(swapPriceImpact.deltaUsd, swapPriceImpact.bps),
        isHighPriceImpact,
      };
    },
  },

  components: {
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.price-impact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.title {
  gap: 4px;
  display: flex;
  align-items: center;
  color: #878b93;
}

.warning {
  color: #cc123f;
}

.value {
  color: #67a069;
}
</style>
