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
          tooltip="Collateral Deposit"
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
        {{ formatUnits(expectedCollateralInUsd, collateralDecimals) }}
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

    <div
      :class="[
        'position-info-item',
        'liquidation-price',
        expectedPositionAmounts.positionHealth.status,
      ]"
    >
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
      <div class="position-health">
        {{ expectedPositionAmounts.positionHealth.status }}
      </div>
      <h4 class="item-title">
        Liquidation price
        <TooltipIcon
          :width="20"
          :height="20"
          fill="#878B93"
          tooltip="MIM to repay"
        />
      </h4>
      <p class="item-value">
        $ {{ formatUnits(expectedPositionAmounts.liquidationPrice) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
// @ts-ignore
import filters from "@/filters";
import { defineAsyncComponent } from "vue";
import { expandDecimals } from "@/helpers/gm/fee/expandDecials";

import { getExpectedPostition } from "@/helpers/cauldron/getExpectedPosition";

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
      return getExpectedPostition(
        this.cauldron,
        this.actionConfig,
        //@ts-ignore
        this.actionType
      );
    },

    expectedCollateralInUsd() {
      const price = this.cauldron.mainParams.collateralPrice;
      return this.expectedPositionAmounts.collateralAmount
        .mul(price)
        .div(expandDecimals(1, this.collateralDecimals));
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
  transition: all 0.3s ease;
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
  padding: 3px 5px;
  min-width: 86px;
  text-align: center;
  border-radius: 16px 0px;
  background: #67a069;
  font-size: 14px;
  line-height: 150%;
  color: #fff;
  text-transform: capitalize;
  transition: all 0.3s ease;
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

@media screen and (max-width: 1024px) {
  .position-info {
    max-width: 640px;
    width: 100%;
  }
}
</style>
