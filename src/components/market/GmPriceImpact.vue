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
import { BigNumber } from "ethers";
import { formatDeltaUsd } from "@/helpers/gm/numbers";
import { defineAsyncComponent, type PropType } from "vue";
import type { CauldronInfo } from "@/helpers/cauldron/types";
import { getDepositAmountsAndFee } from "@/helpers/gm/getDepositAmount";
import { getWithdrawalAmountsAndFees } from "@/helpers/gm/getWithdrawalAmounts";

const ACTION_LEVERAGE = 1;
const ACTION_DELEVERAGE = 2;

const emptyState = {
  swapFee: 0,
  isHighPriceImpact: false,
};

export default {
  props: {
    cauldronObject: {
      type: Object as PropType<CauldronInfo>,
      required: true,
    },
    amount: {
      type: BigNumber,
      default: BigNumber.from(0),
    },
    actionType: {
      type: Number,
      default: ACTION_LEVERAGE,
    },
  },

  data() {
    return {
      tooltipText: "Swap price impact",
    };
  },

  computed: {
    toShortTokenAmount() {
      return this.amount.div(1e12);
    },

    priceImpact() {
      if (!this.cauldronObject) return emptyState;

      switch (this.actionType) {
        case ACTION_LEVERAGE:
          return this.priceImpactDeposit;
        case ACTION_DELEVERAGE:
          return this.priceImpactWithdraw;
        default:
          return emptyState;
      }
    },

    priceImpactDeposit() {
      if (this.amount && +this.amount === 0) return emptyState;
      if (this.actionType !== ACTION_LEVERAGE) return emptyState;

      const { gmInfo } = this.cauldronObject.additionalInfo;

      const { fees, isHighPriceImpact } = getDepositAmountsAndFee(
        gmInfo.marketInfo,
        gmInfo.marketFullInfo,
        gmInfo.dataStoreInfo,
        this.toShortTokenAmount
      );

      if (!fees || !fees.swapPriceImpact) {
        return emptyState;
      }

      const { swapPriceImpact } = fees;

      return {
        swapFee: formatDeltaUsd(swapPriceImpact.deltaUsd, swapPriceImpact.bps),
        isHighPriceImpact,
      };
    },

    priceImpactWithdraw() {
      if (this.amount && +this.amount === 0) return emptyState;
      if (this.actionType !== ACTION_DELEVERAGE) return emptyState;

      const { gmInfo } = this.cauldronObject.additionalInfo;
      const withdrawalData = getWithdrawalAmountsAndFees(
        gmInfo.marketInfo,
        gmInfo.marketFullInfo,
        gmInfo.dataStoreInfo,
        this.amount
      );

      if (!("fees" in withdrawalData)) return emptyState;

      return {
        swapFee: formatDeltaUsd(
          withdrawalData.fees.swapPriceImpact?.deltaUsd ?? BigNumber.from(0),
          withdrawalData.fees.swapPriceImpact?.bps ?? BigNumber.from(0)
        ),
        isHighPriceImpact: withdrawalData.isHighPriceImpact || false,
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
