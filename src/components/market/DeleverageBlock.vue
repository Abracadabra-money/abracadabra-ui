<template>
  <div>
    <div>
      <div class="row">
        <h3 class="title">To Repay</h3>
      </div>

      <h4 class="subtitle">Chose the amount of MIM you want to repay</h4>
    </div>

    <AmountRange
      :amount="deleverageAmounts.amountToMin"
      :maxAmount="maxToRepay"
      :risk="positionHealth"
      @updateAmount="onUpdateInputAmount"
    />
  </div>
</template>

<script lang="ts">
import { BigNumber, utils } from "ethers";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { mapGetters } from "vuex";

import {
  getLiquidationPrice,
  getPositionHealth,
  getDeleverageAmounts,
  PERCENT_PRESITION,
} from "@/helpers/cauldron/utils";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    deleverageAmounts: {
      default: {
        amountFrom: BigNumber.from(0),
        amountToMin: BigNumber.from(0),
      },
    },
    withdrawAmount: {
      type: BigNumber,
    },
  },

  emits: ["updateDeleverageAmounts"],

  data() {
    return { slippage: 1};
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    maxToRepay() {
      const { decimals } = this.cauldron.config.collateralInfo;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { mimBalance } = this.cauldron.userTokensInfo;
      const maxToRepay = userBorrowAmount.gt(mimBalance)
        ? mimBalance
        : userBorrowAmount;

      return maxToRepay;
    },

    expectedBorrowAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;

      //@ts-ignore
      const { amountToMin } = this.deleverageAmounts;

      const expectedBorrowAmount = userBorrowAmount.sub(amountToMin);

      return expectedBorrowAmount.lt(0)
        ? BigNumber.from(0)
        : expectedBorrowAmount;
    },

    expectedCollateralAmount() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;
      //@ts-ignore
      const { amountFrom } = this.deleverageAmounts;

      const expectedCollateralAmount = userCollateralAmount.sub(amountFrom).sub(this.withdrawAmount);

      return expectedCollateralAmount.lt(0)
        ? BigNumber.from(0)
        : expectedCollateralAmount;
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedBorrowAmount,
        this.expectedCollateralAmount,
        this.cauldron.config.mcr,
        this.cauldron.config.collateralInfo.decimals
      );
    },

    positionHealth() {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const { decimals } = this.cauldron.config.collateralInfo;

      const { status } = getPositionHealth(
        this.expectedLiquidationPrice,
        oracleExchangeRate,
        decimals
      );

      return status;
    },
  },

  methods: {
    onUpdateInputAmount(value: BigNumber) {
      const { oracleExchangeRate } = this.cauldron.mainParams;
      const slippage = utils.parseUnits(
        String(this.slippage),
        PERCENT_PRESITION
      );

      const deleverageAmounts = getDeleverageAmounts(
        value,
        slippage,
        oracleExchangeRate
      );

      this.$emit("updateDeleverageAmounts", deleverageAmounts);
    },
  },

  components: {
    AmountRange: defineAsyncComponent(
      () => import("@/components/ui/range/AmountRange.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
}

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 370px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
