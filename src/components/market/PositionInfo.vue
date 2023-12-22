<template>
  <div class="position-info">
    <h3 class="title">Open position</h3>
    <div class="position-info-item collateral-deposit">
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
        {{ formatUnits(expectedCollateralAmount, collateralDecimals) }} ETH
      </p>
      <p class="item-price">$ 3,009</p>
    </div>
    <div class="position-info-item mim-to-repay">
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
          class="mim-icon"
          src="@/assets/images/tokens/MIM.png"
          alt="Mim icon"
        />
        {{ formatUnits(expectedBorrowAmount) }}
      </p>
    </div>

    <div class="position-info-item liquidation-price">
      <div class="status">Safe</div>
      <div class="inner-wrap">
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
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
// @ts-ignore
import filters from "@/filters";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    expectedCollateralAmount: {
      type: Object as any,
    },
    expectedBorrowAmount: {
      type: Object as any,
    },
    expectedLiquidationPrice: {
      type: Object as any,
    },
  },
  computed: {
    collateralDecimals() {
      return this.cauldron.config.collateralInfo.decimals;
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
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

.mim-icon {
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

.collateral-deposit {
  background: url("@/assets/images/market/collateral-deposit-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.mim-to-repay {
  background: url("@/assets/images/market/mim-to-repay-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.liquidation-price {
  padding: 1px;
  border: none;
  background: linear-gradient(
    134.52deg,
    #67a069 5.28%,
    rgba(103, 160, 105, 0) 104.52%
  );
  position: relative;

  .inner-wrap {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: url("@/assets/images/market/liquidation-price-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.status {
  position: absolute;
  top: 0;
  left: 0;
  padding: 3px 28px;
  text-align: center;
  border-radius: 16px 0px;
  background: #67a069;
  font-size: 14px;
  line-height: 150%;
}
</style>
