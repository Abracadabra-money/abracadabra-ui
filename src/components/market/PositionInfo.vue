<template>
  <div class="position-info">
    <h3 class="title">Open position</h3>

    <div class="position-info-item">
      <img
        class="icon-left-top"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />
      <h4 class="item-title">
        Collateral Deposit
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#878B93"
          tooltip=" Collateral Deposit"
        />
      </h4>
      <p class="item-value">
        <img
          class="token-icon"
          :src="cauldron.config.icon"
          alt="Collateral icon"
        />
        {{
          formatUnits(
            expectedPositionAmounts.collateralAmount,
            collateralDecimals
          )
        }}
      </p>
      <p class="item-price">
        $
        {{
          formatUnits(
            expectedPositionAmounts.collateralInUds,
            collateralDecimals
          )
        }}
      </p>
    </div>

    <div class="position-info-item">
      <img
        class="icon-right-center"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />
      <h4 class="item-title">
        MIM to repay
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#878B93"
          tooltip="MIM to repay"
        />
      </h4>
      <p class="item-value">
        <img
          class="token-icon"
          src="@/assets/images/tokens/MIM.png"
          alt="Mim icon"
        />
        {{ formatUnits(expectedPositionAmounts.mimAmount) }}
      </p>
    </div>

    <div :class="['position-info-item', 'liquidation-price', positionHealth]">
      <img
        class="icon-left-bottom"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />
      <img
        class="icon-right-top"
        src="@/assets/images/market/m-icon.svg"
        alt=""
      />
      <div class="position-health">{{ positionHealth }}</div>
      <h4 class="item-title">
        Liquidation price
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#878B93"
          tooltip="MIM to repay"
        />
      </h4>
      <p class="item-value">{{ formatUnits(expectedLiquidationPrice) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { utils, BigNumber } from "ethers";
// @ts-ignore
import filters from "@/filters";
import { defineAsyncComponent } from "vue";
import {
  applyBorrowFee,
  getLiquidationPrice,
  getPositionHealth,
} from "@/helpers/cauldron/utils";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    actionConfig: {
      type: Object as any,
    },
    actionType: {
      type: String, // borrow or repay
    },
  },
  computed: {
    collateralDecimals() {
      return this.cauldron.config.collateralInfo.decimals;
    },

    expectedPositionAmounts() {
      if (this.actionType === "repay") {
        return {
          collateralAmount: this.expectedRepayCollateralAmount,
          collateralInUds: this.expectedRepayCollateralInUsd,
          mimAmount: this.expectedRepayMimAmount,
        };
      }

      if (this.actionType === "borrow") {
        return {
          collateralAmount: this.expectedBorrowCollateralAmount,
          collateralInUds: this.expectedBorrowCollateralInUsd,
          mimAmount: this.expectedBorrowMimAmount,
        };
      }

      return {
        collateralAmount: BigNumber.from(0),
        collateralInUds: BigNumber.from(0),
        mimAmount: BigNumber.from(0),
      };
    },

    expectedRepayCollateralAmount() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const { withdrawAmount } = this.actionConfig.amounts;
      const { amountFrom } = this.actionConfig.amounts.deleverageAmounts;

      const expectedCollateralAmount = this.actionConfig.useDeleverage
        ? userCollateralAmount.sub(withdrawAmount).sub(amountFrom)
        : userCollateralAmount.sub(withdrawAmount);

      return expectedCollateralAmount.lt(0)
        ? BigNumber.from(0)
        : expectedCollateralAmount;
    },

    expectedRepayCollateralInUsd() {
      const price = this.cauldron.mainParams.collateralPrice;
      return this.expectedRepayCollateralAmount
        .mul(price)
        .div(expandDecimals(1, this.collateralDecimals));
    },

    expectedRepayMimAmount() {
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { repayAmount } = this.actionConfig.amounts;
      const { amountToMin } = this.actionConfig.amounts.deleverageAmounts;

      const expectedMimAmount = this.actionConfig.useDeleverage
        ? userBorrowAmount.sub(amountToMin)
        : userBorrowAmount.sub(repayAmount);

      return expectedMimAmount.lt(0) ? BigNumber.from(0) : expectedMimAmount;
    },

    expectedBorrowCollateralAmount() {
      const { userCollateralAmount } =
        this.cauldron.userPosition.collateralInfo;

      const { depositAmounts, leverageAmounts } = this.actionConfig.amounts;

      if (this.actionConfig.useLeverage)
        return userCollateralAmount
          .add(depositAmounts.collateralTokenAmount)
          .add(leverageAmounts.amountToMin);

      return userCollateralAmount.add(depositAmounts.collateralTokenAmount);
    },

    expectedBorrowCollateralInUsd() {
      const price = this.cauldron.mainParams.collateralPrice;
      return this.expectedBorrowCollateralAmount
        .mul(price)
        .div(expandDecimals(1, this.collateralDecimals));
    },

    expectedBorrowMimAmount() {
      const { borrowFee } = this.cauldron.mainParams;
      const { userBorrowAmount } = this.cauldron.userPosition.borrowInfo;
      const { leverageAmounts, borrowAmount } = this.actionConfig.amounts;

      if (this.actionConfig.useLeverage)
        return applyBorrowFee(leverageAmounts.amountFrom, borrowFee * 1000).add(
          userBorrowAmount
        );

      return applyBorrowFee(borrowAmount, borrowFee * 1000).add(
        userBorrowAmount
      );
    },

    expectedLiquidationPrice() {
      return getLiquidationPrice(
        this.expectedPositionAmounts.mimAmount,
        this.expectedPositionAmounts.collateralAmount,
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
    formatUnits(value: any, decimals = 18) {
      return filters.formatToFixed(utils.formatUnits(value, decimals), 2);
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
.position-info {
  @include font;
  max-width: 410px;
  padding: 24px;
  width: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  text-align: left;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
}

.position-info-item {
  width: 100%;
  padding: 24px;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  position: relative;
  overflow: hidden;
}

.icon-left-top {
  position: absolute;
  top: 17px;
  left: -11px;
}

.icon-left-bottom {
  position: absolute;
  top: 86px;
  left: 0;
}
.icon-right-center {
  position: absolute;
  top: 65px;
  right: -21px;
}

.icon-right-top {
  position: absolute;
  top: 13px;
  right: -13px;
}

.item-title {
  color: #99a0b2;
  text-align: center;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.item-value {
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.token-icon {
  width: 32px;
  height: 32px;
}

.item-price {
  color: #878b93;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
}

.position-health {
  position: absolute;
  top: 0;
  left: 0;
  padding: 3px 28px;
  text-align: center;
  border-radius: 16px 0px;
  background: #67a069;
  font-size: 14px;
  line-height: 150%;
  color: #fff;
  text-transform: capitalize;
}

.safe {
  border: 1px solid rgba(103, 160, 105, 0.7);

  .item-value {
    color: #67a069;
  }
}

.medium {
  border: 1px solid rgba(167, 131, 0, 0.7);

  .item-value {
    color: #a78300;
  }

  .position-health {
    background: #a78300;
  }
}

.high {
  border: 1px solid rgba(79, 23, 23, 0.7);

  .item-value {
    color: #4f1717;
  }

  .position-health {
    background: #4f1717;
  }
}
</style>
